import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Jerusalem";

/**
 * Parse user-friendly time input into a dayjs object in Israel timezone.
 * Supports:
 *   "14:30"           → today (or tomorrow if already passed)
 *   "14:30 tomorrow"  → explicit tomorrow
 *   "in 20 minutes"   → relative
 */
export function parseUserTime(input: string): dayjs.Dayjs | null {
  const trimmed = input.trim().toLowerCase();

  // Relative: "in X minutes"
  const relMatch = trimmed.match(/^in\s+(\d+)\s+min(ute)?s?$/);
  if (relMatch) {
    const minutes = parseInt(relMatch[1], 10);
    return dayjs().tz(TZ).add(minutes, "minute");
  }

  // "HH:mm tomorrow"
  const tomorrowMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s+tomorrow$/);
  if (tomorrowMatch) {
    const [, h, m] = tomorrowMatch;
    return dayjs()
      .tz(TZ)
      .add(1, "day")
      .hour(parseInt(h, 10))
      .minute(parseInt(m, 10))
      .second(0)
      .millisecond(0);
  }

  // "HH:mm" — today, or tomorrow if already passed
  const timeMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) {
    const [, h, m] = timeMatch;
    let result = dayjs()
      .tz(TZ)
      .hour(parseInt(h, 10))
      .minute(parseInt(m, 10))
      .second(0)
      .millisecond(0);
    if (result.isBefore(dayjs().tz(TZ))) {
      result = result.add(1, "day");
    }
    return result;
  }

  return null;
}

/** Format a dayjs or ISO string to HH:mm in Israel timezone */
export function formatTime(time: string | dayjs.Dayjs): string {
  const d = typeof time === "string" ? dayjs(time).tz(TZ) : time.tz(TZ);
  return d.format("HH:mm");
}

/** Convert dayjs to ISO 8601 string for DB storage */
export function toISO(time: dayjs.Dayjs): string {
  return time.toISOString();
}
