import { getChannel } from "../config/rabbitmq.js";
 
export const publishPayment = (data: any) => {
    try {
        const channel = getChannel();
 
        channel.sendToQueue(
            "payment_queue",
            Buffer.from(JSON.stringify(data)),
            {
                persistent: true,
                headers: { "x-retries": 0 }
            }
        );
    } catch (error) {
        console.error("Failed to publish payment", error);
    }
};
 