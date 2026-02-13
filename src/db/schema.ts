import { getDb } from "./connection";

export function initSchema(): void {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS rides (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id     TEXT NOT NULL,
      route_id        TEXT NOT NULL,
      direction       TEXT NOT NULL,
      origin          TEXT NOT NULL,
      destination     TEXT NOT NULL,
      departure_time  TEXT NOT NULL,
      available_seats INTEGER NOT NULL DEFAULT 1,
      role            TEXT NOT NULL,
      created_at      TEXT DEFAULT (datetime('now')),
      active          INTEGER DEFAULT 1
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_prefs (
      telegram_id TEXT PRIMARY KEY,
      locale      TEXT NOT NULL DEFAULT 'he'
    );
  `);
}
