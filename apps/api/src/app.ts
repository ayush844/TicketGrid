import express from "express";
import healthRoute from "./routes/health.js";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import testRoutes from "./routes/test.route.js";
import eventRoutes from "./routes/event.route.js";


const app = express();

app.use(cors())
app.use(express.json());

app.use("/", healthRoute);

app.use("/test", testRoutes);

app.use("/auth", authRoute);

app.use("/events", eventRoutes);


export default app;

