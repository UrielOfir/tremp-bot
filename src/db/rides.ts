import { getDb } from "./connection";
import { Ride, Role } from "../models/types";

export interface InsertRide {
  telegram_id: string;
  route_id: string;
  origin: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  role: Role;
}

export function insertRide(ride: InsertRide): Ride {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO rides (telegram_id, route_id, origin, destination, departure_time, available_seats, role)
    VALUES (@telegram_id, @route_id, @origin, @destination, @departure_time, @available_seats, @role)
  `);
  const result = stmt.run(ride);
  return getRideById(result.lastInsertRowid as number)!;
}

export function getRideById(id: number): Ride | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM rides WHERE id = ?").get(id) as Ride | undefined;
}

export function getActiveRidesByUser(telegramId: string): Ride[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM rides WHERE telegram_id = ? AND active = 1 ORDER BY departure_time ASC")
    .all(telegramId) as Ride[];
}

export function getActiveRidesByRole(role: Role, routeId: string): Ride[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM rides WHERE role = ? AND route_id = ? AND active = 1 ORDER BY departure_time ASC")
    .all(role, routeId) as Ride[];
}

export function deactivateRide(id: number, telegramId: string): boolean {
  const db = getDb();
  const result = db.prepare("UPDATE rides SET active = 0 WHERE id = ? AND telegram_id = ?").run(id, telegramId);
  return result.changes > 0;
}

export function getUserLocale(telegramId: string): string {
  const db = getDb();
  const row = db.prepare("SELECT locale FROM user_prefs WHERE telegram_id = ?").get(telegramId) as
    | { locale: string }
    | undefined;
  return row?.locale || "he";
}

export function setUserLocale(telegramId: string, locale: string): void {
  const db = getDb();
  db.prepare("INSERT OR REPLACE INTO user_prefs (telegram_id, locale) VALUES (?, ?)").run(telegramId, locale);
}
