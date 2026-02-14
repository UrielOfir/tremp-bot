export interface LocalizedString {
  he: string;
  en: string;
}

export type Locale = "he" | "en";

export interface Stop {
  id: string;
  name: LocalizedString;
  order: number;
  hub?: string; // ID of main-axis stop this branches from
}

export interface RouteConfig {
  id: string;
  name: LocalizedString;
  stops: Stop[];
}

export type Role = "driver" | "passenger";

export interface Ride {
  id: number;
  telegram_id: string;
  route_id: string;
  origin: string;
  destination: string;
  departure_time: string; // ISO 8601
  available_seats: number;
  role: Role;
  created_at: string;
  active: number;
}

export interface MatchResult {
  ride: Ride;
  timeDiffMinutes: number;
}
