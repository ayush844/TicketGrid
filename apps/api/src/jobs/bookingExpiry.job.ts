import cron from "node-cron";
import { expireBookings } from "../config/cleanupBooking.js";



export const startBookingExpiry = () => {
    cron.schedule("*/10 * * * *", async () => {
        console.log("Running booking expiry job...");
        try {
            await expireBookings();
        } catch (error) {
            console.error("booking expiry job failed", error);
        }
    })
}