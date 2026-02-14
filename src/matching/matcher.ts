import dayjs from "dayjs";
import { Ride, MatchResult, Stop } from "../models/types";
import { matchWindowMinutes, getStop, resolveToHub, isAscending } from "../config";
import { getActiveRidesByRole } from "../db/rides";

/**
 * Check strict branch compatibility between a passenger stop and a driver stop.
 * - If passenger is at a branch: driver must be at the exact same branch.
 * - If passenger is at a hub: driver can be at the hub or any branch of it.
 */
function branchCompatible(passengerStop: Stop, driverStop: Stop): boolean {
  if (passengerStop.hub) {
    return passengerStop.id === driverStop.id;
  }
  return driverStop.id === passengerStop.id || driverStop.hub === passengerStop.id;
}

/**
 * Find matching drivers for a passenger request.
 * Rules:
 *  1. Same route_id
 *  2. Same traversal direction (both ascending or both descending)
 *  3. Driver's segment covers passenger's segment (hub-resolved for order comparison)
 *  4. Strict branch compatibility at origin and destination
 *  5. Departure times within matchWindowMinutes
 *  6. Available seats > 0
 */
export function findMatches(passengerRide: Ride): MatchResult[] {
  const drivers = getActiveRidesByRole("driver", passengerRide.route_id);
  const passengerOrigin = getStop(passengerRide.origin);
  const passengerDest = getStop(passengerRide.destination);
  if (!passengerOrigin || !passengerDest) return [];

  const passengerTime = dayjs(passengerRide.departure_time);
  const paxAscending = isAscending(passengerRide.origin, passengerRide.destination);
  if (paxAscending === null) return [];

  // Resolve passenger stops to hubs for segment overlap
  const effectivePaxOrigin = resolveToHub(passengerOrigin);
  const effectivePaxDest = resolveToHub(passengerDest);

  const results: MatchResult[] = [];

  for (const driver of drivers) {
    // Available seats
    if (driver.available_seats <= 0) continue;

    // Same traversal direction
    const driverAscending = isAscending(driver.origin, driver.destination);
    if (driverAscending !== paxAscending) continue;

    const driverOrigin = getStop(driver.origin);
    const driverDest = getStop(driver.destination);
    if (!driverOrigin || !driverDest) continue;

    // Phase 1: Segment overlap on main axis (hub-resolved)
    const effectiveDriverOrigin = resolveToHub(driverOrigin);
    const effectiveDriverDest = resolveToHub(driverDest);

    if (paxAscending) {
      if (effectiveDriverOrigin.order > effectivePaxOrigin.order) continue;
      if (effectiveDriverDest.order < effectivePaxDest.order) continue;
    } else {
      if (effectiveDriverOrigin.order < effectivePaxOrigin.order) continue;
      if (effectiveDriverDest.order > effectivePaxDest.order) continue;
    }

    // Phase 2: Strict branch compatibility
    if (!branchCompatible(passengerOrigin, driverOrigin)) continue;
    if (!branchCompatible(passengerDest, driverDest)) continue;

    // Time proximity
    const driverTime = dayjs(driver.departure_time);
    const diffMinutes = Math.abs(driverTime.diff(passengerTime, "minute"));
    if (diffMinutes > matchWindowMinutes) continue;

    results.push({ ride: driver, timeDiffMinutes: diffMinutes });
  }

  // Sort by closest departure time
  results.sort((a, b) => a.timeDiffMinutes - b.timeDiffMinutes);
  return results;
}
