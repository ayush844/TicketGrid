import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { prisma } from "../config/prisma.js";



export const getOrganizerEvents = async (req: AuthenticatedRequest, res: Response) => {
    try {
        
        const organizerId = req.user!.userId;

        const events = await prisma.event.findMany({
            where: {
                organizerId,
                deletedAt: null
            },
            select: {
                id: true,
                title: true,
                startTime: true,
                capacity: true,
                ticketsSold: true,
                status: true,
                isPublished: true,
                createdAt: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.json({events});

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getOrganizerDashboard = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const organizerId = req.user!.userId;

        const [events, revenue, totalTickets] = await Promise.all([
            prisma.event.count({
                where: {
                    organizerId,
                    deletedAt: null
                }
            }),

            prisma.payment.aggregate({
                where: {
                    status: "SUCCESS",
                    booking: {
                        event: {
                            organizerId
                        }
                    }
                },
                _sum: {
                    amount: true
                }
            }),

            prisma.ticket.count({
                where: {
                    event: {
                        organizerId
                    }
                }
            })
        ]);

        const upcomingEvents = await prisma.event.count({
            where: {
                organizerId,
                startTime: {
                    gte: new Date()
                }
            }
        });

        return res.json({
            totalEvents: events,
            totalRevenue: revenue._sum.amount || 0,
            totalTicketsSold: totalTickets,
            upcomingEvents
        })


    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


export const getEventStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        
        const {id:eventId} = req.params;

        if(!eventId || Array.isArray(eventId)){
            return res.status(400).json({
                message: "Invalid email ID"
            });
        }

        const event = await prisma.event.findUnique(
            {
                where: {id: eventId},
            }
        );

        if(!event){
            return res.status(404).json({
                message: "Event not found"
            });
        }

        if(event.organizerId != req.user!.userId){
            return res.status(403).json({
                message: "Not Authorized"
            });
        }

        const [totalBookings, totalTickets, revenue, recentBookings] = await Promise.all([
            prisma.booking.count({
                where: {
                    eventId,
                    status: "CONFIRMED"
                }
            }),

            prisma.ticket.count({
                where: {eventId}
            }),

            prisma.payment.aggregate({
                where: {
                    booking: {eventId},
                    status: "SUCCESS"
                },
                _sum: {
                    amount: true
                }
            }),

            prisma.booking.findMany({
                where: {
                    eventId,
                    status: "CONFIRMED"
                },
                include: {
                    user: {
                        select: {
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 5
            })
        ]);

        return res.json({
            eventId: event.id,
            title: event.title,
            capacity: event.capacity,
            ticketSold: event.ticketsSold,
            remainingTickets: event.capacity - event.ticketsSold,
            revenue: revenue._sum.amount || 0,
            totalBookings,
            totalTickets,
            recentBookings
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}