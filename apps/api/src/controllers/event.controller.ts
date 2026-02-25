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

export const updateEvent = async(req: AuthenticatedRequest, res: Response)=>{
    try {

        const {id} = req.params;

        if(!id || Array.isArray(id)){
            console.log("id is >> ", id);
            return res.status(400).json({message: "Invalid Email Id"});
        }

        const existingEvent = await prisma.event.findUnique({
            where: {
                id
            },
            include: {
                location: true
            }
        });

        if(!existingEvent){
            return res.status(404).json({
                message: "Event Not Found"
            });
        }

        if(existingEvent.organizerId != req.user!.userId){
            return res.status(403).json({
                message: "Not authorized to update this event"
            })
        };

        const {title, description, startTime, endTime, capacity, tags, location} = req.body;

        if(startTime && endTime){
            if(new Date(endTime) <= new Date(startTime)){
                return res.status(400).json({
                    message: "End time must be after start time"
                });
            }
        }

        let newSlug = existingEvent.slug;

        if (title && title !== existingEvent.title){
            newSlug = await generateSlug(title);
        }

        const updatedEvent = await prisma.$transaction(async (tx) => {
            if(location){
                await tx.location.update({
                    where: {id: existingEvent.locationId},
                    data: location
                })
            }

            return tx.event.update({
                where: {id},
                data: {
                    title,
                    slug: newSlug,
                    description,
                    capacity,
                    tags,
                    startTime: startTime ? new Date(startTime) : existingEvent.startTime,
                    endTime: endTime ? new Date(endTime) : existingEvent.endTime
                },
                include: {
                    location: true
                }
            });
        });

        return res.status(200).json(updatedEvent);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const publishEvent = async(req: AuthenticatedRequest, res: Response) => {
    try {
        const {id} = req.params;


        if(!id || Array.isArray(id)){
            console.log("id is >> ", id);
            return res.status(400).json({message: "Invalid Email Id"});
        }

        const event = await prisma.event.findUnique(
            {
                where: {id}
            }
        )

        if(!event){
            return res.status(404).json({
                message: "Event not found"
            });
        }

        if(event.organizerId != req.user!.userId){
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        if(event.deletedAt){
            return res.json(400).json({
                message: "event is deleted"
            });
        }

        if(event.startTime <= new Date()){
            return res.status(400).json(
                {message: "can not publish past events"}
            );
        }

        if(event.capacity <= 0){
            return res.status(400).json({
                message: "Capacity must be greater than zero"
            });
        }

        const updated = await prisma.event.update({
            where: {id},
            data: {
                status: "PULISHED",
                isPublished: true,
                publishedAt: new Date()
            }
        })

        return res.json(updated);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const cancelEvent = async(req: AuthenticatedRequest, res: Response) => {
    try {
        const {id} = req.params;

        if(!id || Array.isArray(id)){
            console.log("id is >> ", id);
            return res.status(400).json({message: "Invalid Email Id"});
        }

        const event = await prisma.event.findUnique({
            where: {id}
        })

        if(!event){
            return res.status(404).json({
                message: "event not found"
            });
        }

        if(event.organizerId != req.user!.userId){
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        if(event.deletedAt){
            return res.status(400).json({
                message: "Event is deleted"
            });
        }

        const updated = await prisma.event.update({
            where: {id},
            data: {
                status: "CANCELLED",
                isPublished: false
            }
        });

        return res.json(updated);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


export const softDeleteEvent = async(req: AuthenticatedRequest, res: Response) => {
    try {
        const {id} = req.params;

        if(!id || Array.isArray(id)){
            console.log("id is >> ", id);
            return res.status(400).json({message: "Invalid Email Id"});
        }

        const event = await prisma.event.findUnique(
            {
                where: {id}
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

        const updated = await prisma.event.update({
            where: {id},
            data: {
                deletedAt: new Date(),
                isPublished: false
            }
        });

        return res.json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

