import dayjs from "dayjs";
import { Ride, MatchResult } from "../models/types";
import { activeRoute, matchWindowMinutes, getStop } from "../config";
import { getActiveRidesByRole } from "../db/rides";

/**
 * Find matching drivers for a passenger request.
 * Rules:
 *  1. Same route_id
 *  2. Same direction
 *  3. Driver's segment covers passenger's segment
 *  4. Departure times within matchWindowMinutes
 *  5. Available seats > 0
 */
export function findMatches(passengerRide: Ride): MatchResult[] {
  const drivers = getActiveRidesByRole("driver", passengerRide.route_id);
  const passengerOrigin = getStop(passengerRide.origin);
  const passengerDest = getStop(passengerRide.destination);
  if (!passengerOrigin || !passengerDest) return [];

  const passengerTime = dayjs(passengerRide.departure_time);
  const isAscending = passengerRide.direction === activeRoute.directions[0].id;

  const results: MatchResult[] = [];

  for (const driver of drivers) {
    // Same direction
    if (driver.direction !== passengerRide.direction) continue;

    // Available seats
    if (driver.available_seats <= 0) continue;

    const driverOrigin = getStop(driver.origin);
    const driverDest = getStop(driver.destination);
    if (!driverOrigin || !driverDest) continue;

    // Stop overlap: driver's segment must cover passenger's segment
    if (isAscending) {
      // Eastbound: orders ascending
      if (driverOrigin.order > passengerOrigin.order) continue;
      if (driverDest.order < passengerDest.order) continue;
    } else {
      // Westbound: orders descending
      if (driverOrigin.order < passengerOrigin.order) continue;
      if (driverDest.order > passengerDest.order) continue;
    }

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
