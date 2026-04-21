import express from "express";
import healthRoute from "./routes/health.js";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import testRoutes from "./routes/test.route.js";
import eventRoutes from "./routes/event.route.js";
import uploadRoutes from "./routes/upload.route.js";
import bookingRoutes from "./routes/booking.route.js";
import paymentRoutes from "./routes/payment.route.js";
import webhookRoutes from "./routes/webhook.route.js";
import userBookingRoutes from "./routes/userBooking.route.js";
import orgainizerStatsRoutes from "./routes/organizerStats.routes.js";
import { globalLimiter } from "./middlewares/rateLimit.middleware.js";


const app = express();

app.set("trust proxy", 1);

app.use("/webhooks", express.raw({ type: "application/json" }), webhookRoutes);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        "http://localhost:3000",
      "https://ticketgrid.xyz",
      "https://www.ticketgrid.xyz",
      "https://ticket-grid-web-p2pb.vercel.app",
       process.env.FRONTEND_URL
      ];

      if (!origin) return callback(null, true);

      if (allowed.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(globalLimiter);

app.use("/", healthRoute);

app.use("/test", testRoutes);

app.use("/auth", authRoute);

app.use("/events", eventRoutes);

app.use("/uploads", uploadRoutes);

app.use("/api", bookingRoutes);

app.use("/api", paymentRoutes);

app.use("/api", userBookingRoutes);

app.use("/api", orgainizerStatsRoutes);

export default app;

