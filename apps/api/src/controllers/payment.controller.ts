import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { prisma } from "../config/prisma.js";
import { stripe } from "../config/stripe.js";



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