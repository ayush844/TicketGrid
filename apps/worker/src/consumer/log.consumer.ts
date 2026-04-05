import amqp from "amqplib";
import { addLogToBuffer } from "../services/logBuffer.service.js";

export const startLogConsumer = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);

    const channel = await connection.createChannel();
    channel.prefetch(10);

    await channel.assertQueue("activity_logs", {
        durable: true,
        deadLetterExchange: "dlx"
    });

    console.log("Worker listening for logs...");

    const MAX_RETRIES = 3;

    channel.consume("activity_logs", async (msg) => {
        if(!msg) return;

        try {

            const data = JSON.parse(msg.content.toString());

            addLogToBuffer(data);
            channel.ack(msg);
            
        } catch (error) {

            const retries = msg.properties.headers?.["x-retries"] ?? 0;

            if(retries >= MAX_RETRIES){
                console.error("Message failed permanently:", error);

                channel.reject(msg, false);

            }else{
                console.log(`Retrying message, attempt ${retries + 1}`);

                channel.sendToQueue("activity_logs", msg.content, {
                    persistent: true,
                    headers: {
                        "x-retries": retries + 1
                    }
                });

                channel.ack(msg);
            }
        }
    })
}