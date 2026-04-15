import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { prisma } from "../config/prisma.js";


export const reserveTickets = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {id: eventId} = req.params;
        const {quantity} = req.body;

        if(!eventId || Array.isArray(eventId)){
            return res.status(400).json({message: "Event ID is required"});
        }

        if( typeof quantity !== "number" || quantity < 1 || quantity > 10){
            return res.status(400).json({message: "Quantity must be a number between 1 and 10"});
        }

        const booking = await prisma.$transaction(async (tx) => {

            const existingBooking = await tx.booking.findFirst({
                where: {
                    userId: req.user!.userId,
                    eventId: eventId,
                    status: "PENDING"
                }
            });

            if(existingBooking){
                throw new Error("A booking is already in progress for this event. If your payment didn’t complete, please wait 10 minutes before trying again.");
            }

            const event = await tx.event.findUnique({
                where: {
                    id: eventId
                }
            });

            if(!event){
                throw new Error("Event not found");
            }

            if(!event.isPublished || event.deletedAt){
                throw new Error("Event not available");
            }

            if(event.startTime <= new Date()){
                throw new Error("Event already started");
            }

            const remaining = event.capacity - event.ticketsSold;

            if(remaining < quantity){
                throw new Error("Not enough tickets available");
            }

            const totalAmount = event.price * quantity;

            const expiry = new Date(Date.now() + 10 * 60 * 1000);

            const booking = await tx.booking.create({
                data: {
                    userId: req.user!.userId,
                    eventId: event.id,
                    quantity,
                    totalAmount,
                    status: "PENDING",
                    expiresAt: expiry
                }
            });
            
            return booking;
        })

        return res.status(201).json({
            bookingId: booking?.id,
            quantity: booking?.quantity,
            totalAmount: booking?.totalAmount,
            status: booking?.status
        });
            
    } catch (error: any) {
        console.error(error);
        return res.status(400).json({
            message: error.message || "Reservation failed"
        })
    }
}