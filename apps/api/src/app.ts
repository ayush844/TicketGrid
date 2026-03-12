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


const app = express();


// Stripe webhook MUST use raw body
app.use("/webhooks", express.raw({ type: "application/json" }), webhookRoutes);
app.use(cors())
app.use(express.json());

app.use("/", healthRoute);

app.use("/test", testRoutes);

app.use("/auth", authRoute);

app.use("/events", eventRoutes);

app.use("/uploads", uploadRoutes);

app.use("/api", bookingRoutes);

app.use("/api", paymentRoutes);

// app.use("/webbhooks", webhookRoutes);

export default app;

