import { Context, Markup } from "telegraf";
import { activeRoute, getStop, isSameHubGroup, isAscending, resolveToHub } from "../../config";
import { insertRide, getUserLocale } from "../../db/rides";
import { t } from "../../i18n";
import { Locale, Role } from "../../models/types";
import { parseUserTime, formatTime, toISO } from "../../utils/time";
import { findMatches } from "../../matching/matcher";

interface FlowState {
  role: Role;
  origin?: string;
  destination?: string;
  step: "origin" | "destination" | "time" | "seats";
}

// In-memory conversation state per user
const sessions = new Map<string, FlowState>();

export function getSession(telegramId: string): FlowState | undefined {
  return sessions.get(telegramId);
}

export function clearSession(telegramId: string): void {
  sessions.delete(telegramId);
}

/** Start ride creation flow */
export function startRideFlow(ctx: Context, role: Role): void {
  const telegramId = String(ctx.from!.id);
  const locale = getUserLocale(telegramId) as Locale;

  sessions.set(telegramId, { role, step: "origin" });

  const buttons = activeRoute.stops.map((stop) =>
    Markup.button.callback(stop.name[locale], `stop:${stop.id}`)
  );

  ctx.reply(t("pick_origin", locale), Markup.inlineKeyboard(buttons, { columns: 2 }));
}

/** Handle stop selection callbacks */
export function handleStopSelection(ctx: Context & { match: RegExpExecArray }): void {
  const telegramId = String(ctx.from!.id);
  const locale = getUserLocale(telegramId) as Locale;
  const session = sessions.get(telegramId);
  if (!session) return;

  const stopId = ctx.match[1];

  if (session.step === "origin") {
    session.origin = stopId;
    session.step = "destination";

    // Show destination stops (exclude origin and same hub group)
    const originStop = getStop(stopId)!;
    const buttons = activeRoute.stops
      .filter((s) => !isSameHubGroup(s, originStop))
      .map((stop) => Markup.button.callback(stop.name[locale], `stop:${stop.id}`));

    ctx.editMessageText(t("pick_destination", locale), Markup.inlineKeyboard(buttons, { columns: 2 }));
  } else if (session.step === "destination") {
    if (stopId === session.origin) {
      ctx.answerCbQuery(t("same_stop", locale));
      return;
    }
    session.destination = stopId;
    session.step = "time";

    if (session.role === "driver") {
      ctx.editMessageText(t("pick_time", locale));
    } else {
      ctx.editMessageText(t("pick_time", locale));
    }
  }

  ctx.answerCbQuery();
}

/** Handle time input as text message */
export function handleTimeInput(ctx: Context): void {
  const telegramId = String(ctx.from!.id);
  const locale = getUserLocale(telegramId) as Locale;
  const session = sessions.get(telegramId);
  if (!session || session.step !== "time") return;

  const text = (ctx.message as { text?: string })?.text;
  if (!text) return;

  const parsed = parseUserTime(text);
  if (!parsed) {
    ctx.reply(t("invalid_time", locale));
    return;
  }

  if (session.role === "driver") {
    session.step = "seats";
    // Store time temporarily on the session object
    (session as any).departure_time = toISO(parsed);
    ctx.reply(t("pick_seats", locale));
  } else {
    // Passenger — default 1 seat, create ride immediately
    createAndMatchRide(ctx, session, toISO(parsed), 1);
  }
}

/** Handle seats input */
export function handleSeatsInput(ctx: Context): void {
  const telegramId = String(ctx.from!.id);
  const locale = getUserLocale(telegramId) as Locale;
  const session = sessions.get(telegramId);
  if (!session || session.step !== "seats") return;

  const text = (ctx.message as { text?: string })?.text;
  if (!text) return;

  const seats = parseInt(text, 10);
  if (isNaN(seats) || seats < 1 || seats > 10) {
    ctx.reply(t("pick_seats", locale));
    return;
  }

  const departureTime = (session as any).departure_time as string;
  createAndMatchRide(ctx, session, departureTime, seats);
}

function createAndMatchRide(ctx: Context, session: FlowState, departureTime: string, seats: number): void {
  const telegramId = String(ctx.from!.id);
  const locale = getUserLocale(telegramId) as Locale;

  if (isAscending(session.origin!, session.destination!) === null) {
    clearSession(telegramId);
    return;
  }

  const ride = insertRide({
    telegram_id: telegramId,
    route_id: activeRoute.id,
    origin: session.origin!,
    destination: session.destination!,
    departure_time: departureTime,
    available_seats: seats,
    role: session.role,
  });

  clearSession(telegramId);

  const originStop = getStop(ride.origin)!;
  const destStop = getStop(ride.destination)!;

  const summary = t("ride_summary", locale, {
    origin: originStop.name[locale],
    destination: destStop.name[locale],
    time: formatTime(ride.departure_time),
    seats: ride.available_seats,
  });

  ctx.reply(`${t("ride_created", locale)}\n${summary}`);

  // If passenger, find matching drivers
  if (session.role === "passenger") {
    const matches = findMatches(ride);
    if (matches.length === 0) {
      ctx.reply(t("no_matches", locale));
    } else {
      ctx.reply(t("matches_found", locale, { count: matches.length }));
      for (const match of matches) {
        const mOrigin = getStop(match.ride.origin)!;
        const mDest = getStop(match.ride.destination)!;
        // Try to get driver's username via Telegram API
        const key = match.ride.telegram_id;
        ctx.telegram.getChat(Number(key)).then((chat) => {
          const username = (chat as any).username;
          const template = username ? "match_item" : "match_item_no_username";
          ctx.reply(
            t(template, locale, {
              id: match.ride.id,
              origin: mOrigin.name[locale],
              destination: mDest.name[locale],
              time: formatTime(match.ride.departure_time),
              seats: match.ride.available_seats,
              username: username || "",
            })
          );
        }).catch(() => {
          ctx.reply(
            t("match_item_no_username", locale, {
              id: match.ride.id,
              origin: mOrigin.name[locale],
              destination: mDest.name[locale],
              time: formatTime(match.ride.departure_time),
              seats: match.ride.available_seats,
            })
          );
        });
      }
    }
  }

  // If driver, find matching passengers and notify them
  if (session.role === "driver") {
    // Reverse match: create a pseudo-passenger query to find waiting passengers
    const passengerMatches = findMatchesForDriver(ride);
    if (passengerMatches.length > 0) {
      ctx.reply(t("matches_found", locale, { count: passengerMatches.length }));
    }
  }
}

/** Find passengers that match a new driver's ride (branch-aware) */
function findMatchesForDriver(driverRide: import("../../models/types").Ride) {
  const { getActiveRidesByRole } = require("../../db/rides");
  const dayjs = require("dayjs");
  const { matchWindowMinutes, getStop: gs, resolveToHub: rth, isAscending: isAsc } = require("../../config");

  const passengers = getActiveRidesByRole("passenger", driverRide.route_id) as import("../../models/types").Ride[];
  const driverOrigin = gs(driverRide.origin);
  const driverDest = gs(driverRide.destination);
  if (!driverOrigin || !driverDest) return [];

  const driverTime = dayjs(driverRide.departure_time);
  const driverAsc = isAsc(driverRide.origin, driverRide.destination);
  if (driverAsc === null) return [];

  // Resolve driver stops to hubs for segment overlap
  const effectiveDriverOrigin = rth(driverOrigin);
  const effectiveDriverDest = rth(driverDest);

  const results: import("../../models/types").MatchResult[] = [];

  for (const passenger of passengers) {
    // Same traversal direction
    const pAsc = isAsc(passenger.origin, passenger.destination);
    if (pAsc !== driverAsc) continue;

    const pOrigin = gs(passenger.origin);
    const pDest = gs(passenger.destination);
    if (!pOrigin || !pDest) continue;

    // Phase 1: Segment overlap on main axis (hub-resolved)
    const effectivePOrigin = rth(pOrigin);
    const effectivePDest = rth(pDest);

    if (driverAsc) {
      if (effectiveDriverOrigin.order > effectivePOrigin.order) continue;
      if (effectiveDriverDest.order < effectivePDest.order) continue;
    } else {
      if (effectiveDriverOrigin.order < effectivePOrigin.order) continue;
      if (effectiveDriverDest.order > effectivePDest.order) continue;
    }

    // Phase 2: Strict branch compatibility
    // Passenger at a branch → driver must be at same branch
    // Passenger at a hub → driver can be at hub or any branch of it
    if (pOrigin.hub) {
      if (pOrigin.id !== driverOrigin.id) continue;
    } else {
      if (driverOrigin.id !== pOrigin.id && driverOrigin.hub !== pOrigin.id) continue;
    }
    if (pDest.hub) {
      if (pDest.id !== driverDest.id) continue;
    } else {
      if (driverDest.id !== pDest.id && driverDest.hub !== pDest.id) continue;
    }

    const pTime = dayjs(passenger.departure_time);
    const diff = Math.abs(driverTime.diff(pTime, "minute"));
    if (diff > matchWindowMinutes) continue;

    results.push({ ride: passenger, timeDiffMinutes: diff });
  }

  return results;
}
