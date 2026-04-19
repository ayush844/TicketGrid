import amqp from "amqplib";
import { addLogToBuffer } from "../services/logBuffer.service.js";
import { bookingEmailTemplate } from "../templates/bookingConfirm.template.js";
import { sendEmail } from "../services/email.service.js";
import { welcomeEmailTemplate } from "../templates/welcome.template.js";
import { eventCancelledTemplate } from "../templates/eventCancelled.template.js";
import { forgotPasswordTemplate } from "../templates/forgotPassword.template.js";
import { connectRabbitMQ } from "../config/rabbbitmq.js";

export const startEmailConsumer = async () => {
    const channel = await connectRabbitMQ();

    await channel.assertQueue("email_queue", {
        durable: true,
        deadLetterExchange: "dlx",
        deadLetterRoutingKey: "failed_emails"
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

            if (payload.type === "EVENT_CANCELLED") {
                await sendEmail({
                    to: payload.email,
                    subject: "❌ Event Cancelled",
                    html: eventCancelledTemplate(payload.data)
                });
            }

            if (payload.type === "FORGOT_PASSWORD") {
                await sendEmail({
                    to: payload.email,
                    subject: "🔐 Reset your password",
                    html: forgotPasswordTemplate(payload.data)
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