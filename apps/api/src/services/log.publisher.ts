import { getChannel } from "../config/rabbitmq.js";


export const publishLog = (data: any) => {
    try {
        const channel = getChannel();

        channel.sendToQueue("activity_logs", Buffer.from(JSON.stringify(data)), {persistent: true});
    } catch (error) {
        console.error("Failed to publish log", error);
    }
}