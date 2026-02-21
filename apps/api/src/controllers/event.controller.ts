import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { generateSlug } from "../utils/slug.utils.js";
import { prisma } from "../config/prisma.js";


export const createEvent = async(req: AuthenticatedRequest, res: Response)=>{
    try {
        
        const {title, description, startTime, endTime, capacity, tags, location} = req.body;

        if(new Date(startTime) >= new Date(endTime)){
            return res.status(400).json({
                message: "End time must be after start time"
            })
        }

        const slug = await generateSlug(title);

        const event = await prisma.$transaction(async (tx) =>{
            const createdLocation = await tx.location.create({
                data: location
            });

            return tx.event.create({
                data: {
                    title,
                    slug,
                    description,
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                    capacity,
                    organizerId: req.user!.userId,
                    locationId: createdLocation.id,
                    tags
                },
                include: {
                    location: true
                }
            });
        });

        return res.status(201).json(event);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}