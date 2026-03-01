import app from "./app.js";
import { connectMongo } from "./config/mongo.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  await connectMongo();
  await connectRabbitMQ();
  console.log(`API running on port ${PORT}`);
});
