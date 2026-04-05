import type { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../config/stripe.js";
import { prisma } from "../config/prisma.js";
import { generateQRCode } from "../utils/qr.utils.js";

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
        console.error("Webhook signature verification failed", error.message);
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
                    booking: {
                        include: {
                            event: true
                        }
                    }
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

            if(payment.status == "SUCCESS"){
                console.error("Webhook already processed");
                return res.json({received: true});
            }

            const booking = payment.booking;

            await prisma.$transaction(async (tx) => {

                // update payment
                await tx.payment.update({
                    where: {id: payment.id},
                    data: {
                        status: "SUCCESS",
                        stripePaymentIntentId: session.payment_intent as string
                    }
                })

                // update booking
                await tx.booking.update({
                    where: {id: booking.id},
                    data: {
                        status: "CONFIRMED"
                    }
                })

                // increament ticket sold
                await tx.event.update({
                    where: {id: booking.eventId},
                    data: {
                        ticketsSold: {
                            increment: booking.quantity
                        }
                    }
                })

                // generate ticket
                const tickets = [];

                for(let i = 0; i < booking.quantity; i++){

                    const ticketId = crypto.randomUUID();
                    const qr = await generateQRCode(ticketId);
                    const ticket = await tx.ticket.create({
                        data: {
                            id: ticketId,
                            bookingId: booking.id,
                            eventId: booking.eventId,
                            userId: booking.userId,
                            qrCode: qr
                        }
                    })


                    tickets.push({
                        ticketId: ticket.id,
                        qrCode: qr
                    });
                }

            })


        } catch (error) {
            console.error("Webhook processing error: ", error);
        }
    }

    res.json({ received: true });
};