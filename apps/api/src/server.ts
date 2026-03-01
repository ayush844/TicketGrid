import app from "./app.js";
import { connectMongo } from "./config/mongo.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  await connectMongo();
  console.log(`API running on port ${PORT}`);
});
