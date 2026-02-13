import { Context } from "telegraf";
import { getActiveRidesByUser, getUserLocale, deactivateRide } from "../../db/rides";
import { t } from "../../i18n";
import { Locale } from "../../models/types";
import { getStop } from "../../config";
import { formatTime } from "../../utils/time";

export function myridesCommand(ctx: Context): void {
  const telegramId = String(ctx.from!.id);
  const locale = getUserLocale(telegramId) as Locale;

  const rides = getActiveRidesByUser(telegramId);
  if (rides.length === 0) {
    ctx.reply(t("my_rides_empty", locale));
    return;
  }

  const lines = rides.map((ride) => {
    const origin = getStop(ride.origin)!;
    const dest = getStop(ride.destination)!;
    return t("my_rides_item", locale, {
      id: ride.id,
      role: t(ride.role, locale),
      origin: origin.name[locale],
      destination: dest.name[locale],
      time: formatTime(ride.departure_time),
    });
  });

  ctx.reply(
    `${t("my_rides_header", locale)}\n\n${lines.join("\n\n")}\n\n${t("cancel_prompt", locale)}`
  );
}

export function cancelCommand(ctx: Context): void {
  const telegramId = String(ctx.from!.id);
  const locale = getUserLocale(telegramId) as Locale;

  const text = (ctx.message as { text?: string })?.text || "";
  const parts = text.split(/\s+/);
  const rideId = parseInt(parts[1], 10);

  if (isNaN(rideId)) {
    ctx.reply(t("cancel_prompt", locale));
    return;
  }

  const success = deactivateRide(rideId, telegramId);
  if (success) {
    ctx.reply(t("ride_cancelled", locale, { id: rideId }));
  } else {
    ctx.reply(t("ride_not_found", locale));
  }
}
