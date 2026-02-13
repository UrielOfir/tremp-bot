import { he } from "./he";
import { en } from "./en";
import { Locale } from "../models/types";

const locales: Record<string, Record<string, string>> = { he, en };

/**
 * Translate a key for a given locale, with optional interpolation.
 * Placeholders like {name} are replaced from the params object.
 */
export function t(key: string, locale: Locale, params?: Record<string, string | number>): string {
  let str = locales[locale]?.[key] ?? locales["he"]?.[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}
