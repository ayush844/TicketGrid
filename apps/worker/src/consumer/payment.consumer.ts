import amqp from "amqplib";
import fetch from "node-fetch";
 
export const startPaymentConsumer = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();
 
    await channel.assertQueue("payment_queue", {
        durable: true,
        deadLetterExchange: "dlx",
        deadLetterRoutingKey: "failed_payments"
    });

    console.log("Worker listening for payment requests...");

    const MAX_RETRIES = 3;
 
    channel.consume("payment_queue", async (msg) => {
        if (!msg) return;
 
        try {
            const payload = JSON.parse(msg.content.toString());
 
            if (payload.type === "PAYMENT_SUCCESS") {
                await fetch(`${process.env.API_URL}/api/internal/process-payment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-worker-secret": process.env.WORKER_SECRET!
                    },
                    body: JSON.stringify({
                        stripeSessionId: payload.stripeSessionId,
                        paymentIntentId: payload.paymentIntentId
                    })
                });
            }
 
            channel.ack(msg);
 
        } catch (error) {
            const retries = msg.properties.headers?.["x-retries"] ?? 0;
 
            if (retries >= MAX_RETRIES) {
                channel.reject(msg, false);
            } else {
                channel.sendToQueue("payment_queue", msg.content, {
                    persistent: true,
                    headers: { "x-retries": retries + 1 }
                });
 
                channel.ack(msg);
            }
        }
    });
};
 