import express from "express";
import healthRoute from "./routes/health.js";
import cors from "cors";
import authRoute from "./routes/auth.route.js";


const app = express();

app.use(cors())
app.use(express.json());

app.use("/", healthRoute);

app.use("/auth", authRoute);


export default app;

