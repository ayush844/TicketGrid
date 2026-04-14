import amqp from "amqplib";
import { addLogToBuffer } from "../services/logBuffer.service.js";
import { bookingEmailTemplate } from "../templates/bookingConfirm.template.js";
import { sendEmail } from "../services/email.service.js";
import { welcomeEmailTemplate } from "../templates/welcome.template.js";

export const startEmailConsumer = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);

    const channel = await connection.createChannel();
    channel.prefetch(10);

    await channel.assertQueue("email_queue", {
        durable: true,
        deadLetterExchange: "dlx"
    });

    console.log("Worker listening for emails...");

    const MAX_RETRIES = 3;

    channel.consume("email_queue", async (msg) => {
        if(!msg) return;

        try {

            const payload = JSON.parse(msg.content.toString());

            console.log("sending email with data:", payload);
            if (payload.type === "BOOKING_CONFIRMATION") {
                const { tickets } = payload.data;

                await sendEmail({
                    to: payload.email,
                    subject: "🎟 Booking Confirmed",
                    html: bookingEmailTemplate(payload.data),
                    attachments: tickets.map((ticket: any, index: number) => ({
                        filename: `ticket-${index}.png`,
                        content: ticket.qrCode.split("base64,")[1],
                        encoding: "base64",
                        cid: `qr-${index}`
                    }))
                });
            }

            if (payload.type === "WELCOME") {
                await sendEmail({
                    to: payload.email,
                    subject: "👋 Welcome to TicketGrid",
                    html: welcomeEmailTemplate(payload.data)
                });
            }

            channel.ack(msg);
            
        } catch (error) {

            const retries = msg.properties.headers?.["x-retries"] ?? 0;

            if(retries >= MAX_RETRIES){
                console.error("Message failed permanently:", error);

                channel.reject(msg, false);

            }else{
                console.log(`Retrying message, attempt ${retries + 1}`);

                channel.sendToQueue("email_queue", msg.content, {
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