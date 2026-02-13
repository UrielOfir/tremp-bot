import { Context } from "telegraf";
import { startRideFlow } from "../conversations/rideFlow";

export function rideCommand(ctx: Context): void {
  startRideFlow(ctx, "passenger");
}
