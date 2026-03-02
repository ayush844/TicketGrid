import amqp from "amqplib";
import { addLogToBuffer } from "../services/logBuffer.service.js";

export const startLogConsumer = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);

    const channel = await connection.createChannel();

    await channel.assertQueue("activity_logs", {
        durable: true
    });

    console.log("Worker listening for logs...");

    channel.consume("activity_logs", (msg) => {
        if(!msg) return;
        const data = JSON.parse(msg.content.toString());

        addLogToBuffer(data);
        channel.ack(msg);
    })
}