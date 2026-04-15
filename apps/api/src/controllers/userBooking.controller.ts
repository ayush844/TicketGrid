import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { prisma } from "../config/prisma.js";



export const getUserBooking = async(req: AuthenticatedRequest, res: Response) => {

    try {

        const userId = req.user!.userId;
        const now = new Date();

        const [upcoming, past] = await Promise.all([
            prisma.booking.findMany({
                where: {
                    userId,
                    status: "CONFIRMED",
                    event: {
                        deletedAt: null,
                        startTime: {gte: now}
                    }
                },
                include: {
                    event: true,
                    tickets: true
                },
                orderBy: {
                    createdAt: "asc"
                }
            }),
            prisma.booking.findMany({
                where: {
                    userId,
                    status: "CONFIRMED",
                    event: {
                        deletedAt: null,
                        startTime: {lte: now}
                    }
                },
                include: {
                    event: true,
                    tickets: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }),

        ]);

        return res.json({
            upcoming,
            past
        });

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


export const getBookingById = async(req: AuthenticatedRequest, res: Response)=>{
    try {
        const {id} = req.params;

        if(!id || Array.isArray(id)){
            return res.status(400).json({
                message: "Invalud booking id"
            });
        }

        const booking = await prisma.booking.findFirst({
            where: {
                id,
                event: {
                    deletedAt: null
                }
            },
            include: {
                event: true,
                tickets: true,
                payment: true
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

        return res.json({
            booking
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}