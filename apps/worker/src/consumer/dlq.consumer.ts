import amqp from "amqplib";

export const startDLQConsumer = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);

    const channel = await connection.createChannel();
    channel.prefetch(5);

    await channel.assertQueue("failed_logs", {
        durable: true
    });

    console.log("listening for failed logs (DLQ)...");

    channel.consume("failed_logs", async (msg) => {
        if(!msg) return;

        const data = msg.content.toString();

        console.error("Received failed log message from DLQ:", data);

        channel.ack(msg);
    })
}