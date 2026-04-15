import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { prisma } from "../config/prisma.js";
import { stripe } from "../config/stripe.js";
import { generateQRCode } from "../utils/qr.utils.js";
import { publishEmail } from "../services/email.publisher.js";



export const createCheckoutSession = async(req: AuthenticatedRequest, res: Response) => {
    try {
        const {id: bookingId} = req.params;

        if(!bookingId || Array.isArray(bookingId)){
            return res.status(400).json("Booking Id is reuired");
        }

        const booking = await prisma.booking.findUnique({
            where: {
                id: bookingId
            },
            include: {
                event: true
            }
        });

        if(!booking){
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if(booking.userId != req.user!.userId){
            return res.status(403).json({
                message: "Not Authorized"
            });
        }

        if(booking.status != "PENDING"){
            return res.status(400).json({
                message: "Booking already processed"
            });
        }

        if(booking.expiresAt && booking.expiresAt < new Date()){
            return res.status(400).json({
                message: "Booking expired"
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: booking.event.title
                        },
                        unit_amount: booking.event.price * 100
                    },
                    quantity: booking.quantity,
                }
            ],

            success_url: `${process.env.FRONTEND_URL}/booking-success?bookingId=${booking.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/booking-cancel?bookingId=${booking.id}`
        });

        const existingPayment = await prisma.payment.findUnique({
            where: { bookingId: booking.id }
        });

        if (existingPayment) {
            return res.json({
                message: "Payment already initiated",
                payment: existingPayment
            });
        }

        await prisma.payment.create({
            data: {
                bookingId: booking.id,
                stripeSessionId: session.id,
                amount: booking.totalAmount,
                status: "PENDING"
            }
        });

        return res.json({
            checkoutUrl: session.url
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Checkout creation failed"
        })
    }
}


export const processPayment = async (req: Request, res: Response) => {
    try {
        if (req.headers["x-worker-secret"] !== process.env.WORKER_SECRET) {
            return res.status(403).json({ message: "Unauthorized" });
        }
 
        const { stripeSessionId, paymentIntentId } = req.body;
 
        const payment = await prisma.payment.findUnique({
            where: { stripeSessionId },
            include: { booking: true }
        });
 
        if (!payment || !payment.booking) {
            return res.json({ message: "No payment/booking" });
        }
 
        const booking = payment.booking;
 
        if (booking.status === "CONFIRMED") {
            return res.json({ message: "Already processed" });
        }
 
        const [user, dbEvent] = await Promise.all([
            prisma.user.findUnique({ where: { id: booking.userId } }),
            prisma.event.findUnique({ where: { id: booking.eventId } })
        ]);
 
        if (!user || !dbEvent) {
            return res.json({ message: "Missing data" });
        }
 
        const ticketsData = await Promise.all(
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
 
        const result = await prisma.$transaction(async (tx) => {
 
            const updatedPayment = await tx.payment.updateMany({
                where: {
                    id: payment.id,
                    status: "PENDING"
                },
                data: {
                    status: "SUCCESS",
                    stripePaymentIntentId: paymentIntentId
                }
            });
 
            if (updatedPayment.count === 0) {
                return { success: false };
            }
 
            await tx.booking.update({
                where: { id: booking.id },
                data: { status: "CONFIRMED" }
            });
 
            await tx.event.update({
                where: { id: booking.eventId },
                data: {
                    ticketsSold: { increment: booking.quantity }
                }
            });
 
            await tx.ticket.createMany({
                data: ticketsData
            });
 
            return { success: true };
        });
 
        if (result.success) {
            publishEmail({
                type: "BOOKING_CONFIRMATION",
                email: user.email,
                data: {
                    eventTitle: dbEvent.title,
                    tickets: ticketsData
                }
            });
        }
 
        return res.json({ success: true });
 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal error" });
    }
};
 