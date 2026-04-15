import type { Request, Response } from "express";
import Stripe from "stripe";
import crypto from "crypto";
import { stripe } from "../config/stripe.js";
import { prisma } from "../config/prisma.js";
import { generateQRCode } from "../utils/qr.utils.js";
import { publishEmail } from "../services/email.publisher.js";
import { publishPayment } from "../services/payment.publisher.js";

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

        publishPayment({
            type: "PAYMENT_SUCCESS",
            stripeSessionId: session.id,
            paymentIntentId: session.payment_intent
        });

    }

    return res.json({ received: true });
};