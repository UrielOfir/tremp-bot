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

// Resolve a branch stop to its hub on the main axis. Main-axis stops return themselves.
export function resolveToHub(stop: Stop): Stop {
  if (stop.hub) {
    return getStop(stop.hub) ?? stop;
  }
  return stop;
}

// Check if two stops belong to the same hub group (same hub, or one is the other's hub).
export function isSameHubGroup(a: Stop, b: Stop): boolean {
  if (a.id === b.id) return true;
  if (a.hub && a.hub === b.id) return true;
  if (b.hub && b.hub === a.id) return true;
  if (a.hub && b.hub && a.hub === b.hub) return true;
  return false;
}

// Check if a ride goes in ascending order (origin order < destination order), resolving branches.
export function isAscending(originId: string, destinationId: string): boolean | null {
  const origin = getStop(originId);
  const destination = getStop(destinationId);
  if (!origin || !destination) return null;
  const effectiveOrigin = resolveToHub(origin);
  const effectiveDest = resolveToHub(destination);
  if (effectiveOrigin.order === effectiveDest.order) return null; // same hub group
  return effectiveOrigin.order < effectiveDest.order;
}
