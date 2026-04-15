import { getChannel } from "../config/rabbitmq.js"

export const publishEmail = (data: any) => {
    try {
        const channel = getChannel();

        channel.sendToQueue("email_queue", Buffer.from(JSON.stringify(data)), {persistent: true, headers: {"x-retries": 0}});
    } catch (error) {
        console.error("Error publishing email:", error);
    }
}