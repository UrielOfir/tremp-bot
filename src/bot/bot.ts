import { Telegraf } from "telegraf";
import { startCommand, handleLangSelection } from "./commands/start";
import { driveCommand } from "./commands/drive";
import { rideCommand } from "./commands/ride";
import { myridesCommand, cancelCommand } from "./commands/myrides";
import {
  handleStopSelection,
  handleTimeInput,
  handleSeatsInput,
  getSession,
} from "./conversations/rideFlow";
import { getUserLocale } from "../db/rides";
import { t } from "../i18n";
import { Locale } from "../models/types";

export function createBot(token: string): Telegraf {
  const bot = new Telegraf(token);

  // Commands
  bot.start((ctx) => startCommand(ctx));
  bot.command("drive", (ctx) => driveCommand(ctx));
  bot.command("ride", (ctx) => rideCommand(ctx));
  bot.command("myrides", (ctx) => myridesCommand(ctx));
  bot.command("cancel", (ctx) => cancelCommand(ctx));
  bot.command("lang", (ctx) => startCommand(ctx)); // reuse start for language picker
  bot.command("help", (ctx) => {
    const locale = getUserLocale(String(ctx.from!.id)) as Locale;
    ctx.reply(t("help", locale));
  });

  // Callback queries
  bot.action(/^lang:(.+)$/, (ctx) => handleLangSelection(ctx));
  bot.action(/^stop:(.+)$/, (ctx) => handleStopSelection(ctx));

  // Text messages — route to active conversation flow or fallback
  bot.on("text", (ctx) => {
    const telegramId = String(ctx.from.id);
    const locale = getUserLocale(telegramId) as Locale;
    const session = getSession(telegramId);

    if (!session) {
      ctx.reply(t("fallback", locale));
      return;
    }

    if (session.step === "origin" || session.step === "destination") {
      ctx.reply(t("use_buttons", locale));
      return;
    }

    if (session.step === "time") {
      handleTimeInput(ctx);
    } else if (session.step === "seats") {
      handleSeatsInput(ctx);
    }
  });

  return bot;
}
