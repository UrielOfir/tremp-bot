import { Context } from "telegraf";
import { startRideFlow } from "../conversations/rideFlow";

export function driveCommand(ctx: Context): void {
  startRideFlow(ctx, "driver");
}
