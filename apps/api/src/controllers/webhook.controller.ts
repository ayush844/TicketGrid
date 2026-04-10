import type { Request, Response } from "express";
import Stripe from "stripe";
import crypto from "crypto";
import { stripe } from "../config/stripe.js";
import { prisma } from "../config/prisma.js";
import { generateQRCode } from "../utils/qr.utils.js";

type TicketData = {
    id: string;
    bookingId: string;
    eventId: string;
    userId: string;
    qrCode: string;
};

export const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error("Webhook signature verification failed:", error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        try {
            const payment = await prisma.payment.findUnique({
                where: {
                    stripeSessionId: session.id
                },
                include: {
                    booking: true
                }
            });

            if (!payment) {
                console.error("Payment not found");
                return res.json({ received: true });
            }

            if (!payment.booking) {
                console.error("Booking missing for payment:", payment.id);
                return res.json({ received: true });
            }

            const booking = payment.booking;

            if(booking.status == "CONFIRMED"){
                return;
            }

            const ticketsData: TicketData[] = await Promise.all(
                Array.from({ length: booking.quantity }).map(async () => {
                    const ticketId = crypto.randomUUID();
                    const qr = await generateQRCode(ticketId);

                    return {
                        id: ticketId,
                        bookingId: booking.id,
                        eventId: booking.eventId,
                        userId: booking.userId,
                        qrCode: qr
                    };
                })
            );

            await prisma.$transaction(async (tx) => {

                const updatedPayment = await tx.payment.updateMany({
                    where: {
                        id: payment.id,
                        status: "PENDING"
                    },
                    data: {
                        status: "SUCCESS",
                        stripePaymentIntentId: session.payment_intent as string
                    }
                });

                if (updatedPayment.count === 0) {
                    console.log("Webhook already processed safely");
                    return;
                }

                await tx.booking.update({
                    where: { id: booking.id },
                    data: {
                        status: "CONFIRMED"
                    }
                });

                await tx.event.update({
                    where: { id: booking.eventId },
                    data: {
                        ticketsSold: {
                            increment: booking.quantity
                        }
                    }
                });

                await tx.ticket.createMany({
                    data: ticketsData
                });
            });

        } catch (error) {
            console.error("Webhook processing error:", error);
        }
    }

    return res.json({ received: true });
};