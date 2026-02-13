import "dotenv/config";
import { initSchema } from "./db/schema";
import { createBot } from "./bot/bot";

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("BOT_TOKEN is required. Set it in .env");
  process.exit(1);
}

// Initialize database
initSchema();
console.log("Database initialized.");

// Start bot
const bot = createBot(token);

bot.launch();
console.log("Bot is running...");

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
