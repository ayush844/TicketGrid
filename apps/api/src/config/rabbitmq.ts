import amqp from "amqplib";

let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async (): Promise<amqp.Channel> => {
  if (channel) return channel;

  while (true) {
    try {
      console.log("Connecting to RabbitMQ...");

      const connection = await amqp.connect(process.env.RABBITMQ_URL!);
      const ch = await connection.createChannel();

      // QoS (optional but good)
      ch.prefetch(10);

      // ---------- DLX SETUP ----------
      await ch.assertExchange("dlx", "direct", { durable: true });

      await ch.assertQueue("activity_logs", {
        durable: true,
        deadLetterExchange: "dlx",
        deadLetterRoutingKey: "failed_logs"
      });

      await ch.assertQueue("failed_logs", { durable: true });
      await ch.bindQueue("failed_logs", "dlx", "failed_logs");

      await ch.assertQueue("email_queue", {
        durable: true,
        deadLetterExchange: "dlx",
        deadLetterRoutingKey: "failed_emails"
      });

      await ch.assertQueue("failed_emails", { durable: true });
      await ch.bindQueue("failed_emails", "dlx", "failed_emails");

      await ch.assertQueue("payment_queue", {
        durable: true,
        deadLetterExchange: "dlx",
        deadLetterRoutingKey: "failed_payments"
      });

      await ch.assertQueue("failed_payments", { durable: true });
      await ch.bindQueue("failed_payments", "dlx", "failed_payments");

      console.log("RabbitMQ connected");

      channel = ch;
      return ch;

    } catch (err) {
      console.error("RabbitMQ connection failed, retrying in 5s...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ not initialized");
  }
  return channel;
};