import { Context, Markup } from "telegraf";
import { getUserLocale, setUserLocale } from "../../db/rides";
import { t } from "../../i18n";
import { Locale } from "../../models/types";

export function startCommand(ctx: Context): void {
  const telegramId = String(ctx.from!.id);
  const locale = getUserLocale(telegramId) as Locale;

  ctx.reply(
    t("welcome", locale),
    Markup.inlineKeyboard([
      Markup.button.callback("עברית", "lang:he"),
      Markup.button.callback("English", "lang:en"),
    ])
  );
}

export function handleLangSelection(ctx: Context & { match: RegExpExecArray }): void {
  const telegramId = String(ctx.from!.id);
  const newLocale = ctx.match[1] as Locale;

  setUserLocale(telegramId, newLocale);
  ctx.editMessageText(t("lang_set", newLocale) + "\n\n" + t("help", newLocale));
  ctx.answerCbQuery();
}
