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
    const { getUserLocale } = require("../db/rides");
    const { t } = require("../i18n");
    const locale = getUserLocale(String(ctx.from!.id));
    ctx.reply(t("help", locale));
  });

  // Callback queries
  bot.action(/^lang:(.+)$/, (ctx) => handleLangSelection(ctx));
  bot.action(/^stop:(.+)$/, (ctx) => handleStopSelection(ctx));

  // Text messages — route to active conversation flow
  bot.on("text", (ctx) => {
    const telegramId = String(ctx.from.id);
    const session = getSession(telegramId);
    if (!session) return;

    if (session.step === "time") {
      handleTimeInput(ctx);
    } else if (session.step === "seats") {
      handleSeatsInput(ctx);
    }
  });

  return bot;
}
