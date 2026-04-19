import amqp from "amqplib";
import type { Channel } from "amqplib";

let channel: Channel | null = null;

export const connectRabbitMQ = async (): Promise<Channel> => {
  if (channel) return channel;

  while (true) {
    try {
      console.log("Connecting to RabbitMQ...");

      const connection = await amqp.connect(process.env.RABBITMQ_URL!);
      const ch = await connection.createChannel();

      ch.prefetch(10);

      await ch.assertExchange("dlx", "direct", { durable: true });

      channel = ch;

      console.log("RabbitMQ connected");

      return ch;
    } catch (err) {
      console.error("RabbitMQ connection failed, retrying in 5s...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};