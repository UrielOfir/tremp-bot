import { RouteConfig, Stop } from "../models/types";
import { route443 } from "./routes/route443";

// Active route — swap this to change which route the bot serves
export const activeRoute: RouteConfig = route443;

// Match window in minutes for ride matching
export const matchWindowMinutes = 15;

// Helper: get stop by id
export function getStop(stopId: string): Stop | undefined {
  return activeRoute.stops.find((s) => s.id === stopId);
}

// Helper: derive direction from origin/destination stop orders
export function deriveDirection(originId: string, destinationId: string): string | null {
  const origin = getStop(originId);
  const destination = getStop(destinationId);
  if (!origin || !destination) return null;
  if (origin.order < destination.order) return activeRoute.directions[0].id; // ascending
  if (origin.order > destination.order) return activeRoute.directions[1].id; // descending
  return null; // same stop
}
