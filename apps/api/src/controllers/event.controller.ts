import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { generateSlug } from "../utils/slug.utils.js";
import { prisma } from "../config/prisma.js";
import { redis } from "../config/redis.js";
import { clearListingCache, invalidateEventCache } from "../utils/cacheHelper.utils.js";
import { publishLog } from "../services/log.publisher.js";
import { LOG_ACTIONS } from "../constants/logActions.js";


export const createEvent = async(req: AuthenticatedRequest, res: Response)=>{
    try {
        
        const {title, description, startTime, endTime, capacity, tags, location, imageUrl, price} = req.body;

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
                    tags,
                    imageUrl,
                    price
                },
                include: {
                    location: true
                }
            });
        });

        await invalidateEventCache();

        publishLog({
            userId: req.user!.userId,
            role: req.user!.role,
            action: LOG_ACTIONS.CREATE_EVENT,
            entityType: "EVENT",
            entityId: event.id,
            metadata: {
                title: event.title
            }
        })

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
            return res.status(400).json({message: "Invalid Event Id"});
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

        const {title, description, startTime, endTime, capacity, tags, location, price, imageUrl} = req.body;

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
                    price,
                    startTime: startTime ? new Date(startTime) : existingEvent.startTime,
                    endTime: endTime ? new Date(endTime) : existingEvent.endTime,
                    imageUrl
                },
                include: {
                    location: true
                }
            });
        });

        await invalidateEventCache(existingEvent.slug);

        if(existingEvent.slug != updatedEvent.slug){
            await invalidateEventCache(updatedEvent.slug);
        }

        publishLog({
            userId: req.user!.userId,
            role: req.user!.role,
            action: LOG_ACTIONS.UPDATE_EVENT,
            entityType: "EVENT",
            entityId: updatedEvent.id,
            metadata: {
                title: updatedEvent.title
            }
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
            return res.status(400).json({message: "Invalid Event Id"});
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
            return res.status(400).json({
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
                status: "PUBLISHED",
                isPublished: true,
                publishedAt: new Date()
            }
        })

        await invalidateEventCache(updated.slug);

        publishLog({
            userId: req.user!.userId,
            role: req.user!.role,
            action: LOG_ACTIONS.PUBLISH_EVENT,
            entityType: "EVENT",
            entityId: updated.id,
            metadata: {
                title: updated.title
            }
        });

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
            return res.status(400).json({message: "Invalid Event Id"});
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

        await invalidateEventCache(updated.slug);

        publishLog({
            userId: req.user!.userId,
            role: req.user!.role,
            action: LOG_ACTIONS.CANCEL_EVENT,
            entityType: "EVENT",
            entityId: updated.id,
            metadata: {
                title: updated.title
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
            return res.status(400).json({message: "Invalid Event Id"});
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
        const delId = event.id;
        const delTitle = event.title;
        const updated = await prisma.event.update({
            where: {id},
            data: {
                deletedAt: new Date(),
                isPublished: false
            }
        });

        await invalidateEventCache(updated.slug);

        publishLog({
            userId: req.user!.userId,
            role: req.user!.role,
            action: LOG_ACTIONS.DELETE_EVENT,
            entityType: "EVENT",
            entityId: delId,
            metadata: {
                title: delTitle
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

export const getPublicEvents = async (req: Request, res: Response) => {
    try {

        const now = new Date();

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const cacheKey = `events:list:page=${page}:limit=${limit}`;

        const cached = await redis.get(cacheKey);
        
        if(cached){
            return res.json(JSON.parse(cached));
        }

        const skip = (page - 1) * limit;

        const [upcoming, past, upcomingCount, pastCount] = await Promise.all([
            prisma.event.findMany({
                where: {
                    isPublished: true,
                    deletedAt: null,
                    startTime: {gte: now}
                },
                skip,
                take: limit,
                orderBy: {startTime: "asc"},
                include: {
                    location: true,
                    organizer: {
                        select: {
                            id: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.event.findMany({
                where: {
                    isPublished: true,
                    deletedAt: null,
                    startTime: {lt: now}
                },
                orderBy: {startTime: "desc"},
                include: {
                    location: true,
                    organizer: {
                        select: {
                            id: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.event.count({
                where: {
                    isPublished: true,
                    deletedAt: null,
                    startTime: { gte: now }
                }
            }),
            prisma.event.count({
                where: {
                    isPublished: true,
                    deletedAt: null,
                    startTime: { lt: now }
                }
            })

        ]);

        const responseData = {
            upcoming,
            past,
            count: {
                upcoming: upcomingCount,
                past: pastCount
            }
        }

        await redis.setex(cacheKey, 60, JSON.stringify(responseData));

        return res.json(responseData);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search as string | undefined;
    const city = req.query.city as string | undefined;
    const tag = req.query.tag as string | undefined;
    const sort = req.query.sort === "desc" ? "desc" : "asc";

    const cities = city ? city.split(",").map(c => c.trim()).filter(Boolean) : [];
    const tags = tag ? tag.split(",").map(t => t.trim().toUpperCase()).filter(Boolean) : [];

    const cacheKey = `events:upcoming:page=${page}:limit=${limit}:search=${search || ""}:city=${city || ""}:tag=${tag || ""}:sort=${sort}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const skip = (page - 1) * limit;


    const filters: any = {
      isPublished: true,
      deletedAt: null,
      startTime: { gte: now }
    };

    if (search) {
      filters.title = {
        contains: search,
        mode: "insensitive"
      };
    }

    // 🏷️ Tags
    if (tags.length > 0) {
        filters.tags = {
            hasSome: tags.map(t => t.toUpperCase())
        };
    }

    // 📍 Cities (case insensitive)
    if (cities.length > 0) {
        filters.OR = cities.map(city => ({
            location: {
            city: {
                equals: city,
                mode: "insensitive"
            }
            }
        }));
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: { startTime: sort },
        include: {
          location: true,
          organizer: {
            select: { id: true, email: true }
          }
        }
      }),
      prisma.event.count({
        where: filters
      })
    ]);

    const response = {
      events,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };

    await redis.setex(cacheKey, 60, JSON.stringify(response));

    return res.json(response);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPastEvents = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search as string | undefined;
    const city = req.query.city as string | undefined;
    const tag = req.query.tag as string | undefined;
    const sort = req.query.sort === "desc" ? "desc" : "asc";

    const cities = city ? city.split(",").map(c => c.trim()).filter(Boolean) : [];
    const tags = tag ? tag.split(",").map(t => t.trim().toUpperCase()).filter(Boolean) : [];

    const cacheKey = `events:past:page=${page}:limit=${limit}:search=${search || ""}:city=${city || ""}:tag=${tag || ""}:sort=${sort}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const skip = (page - 1) * limit;


    const filters: any = {
      isPublished: true,
      deletedAt: null,
      startTime: { lt: now }
    };

    if (search) {
      filters.title = {
        contains: search,
        mode: "insensitive"
      };
    }

    // 🏷️ Tags
    if (tags.length > 0) {
        filters.tags = {
            hasSome: tags.map(t => t.toUpperCase())
        };
    }

    // 📍 Cities (case insensitive)
    if (cities.length > 0) {
        filters.OR = cities.map(city => ({
            location: {
            city: {
                equals: city,
                mode: "insensitive"
            }
            }
        }));
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: { startTime: sort === "asc" ? "asc" : "desc" },
        include: {
          location: true,
          organizer: {
            select: { id: true, email: true }
          }
        }
      }),
      prisma.event.count({
        where: filters
      })
    ]);

    const response = {
      events,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };

    await redis.setex(cacheKey, 60, JSON.stringify(response));

    return res.json(response);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPublicEventBySlug = async (req: Request, res: Response) => {
    try {
        const {slug} = req.params;

        if(!slug || Array.isArray(slug)){
            return res.status(400).json({
                message: "No slug provided"
            });
        }

        const cacheKey = `event:detail:slug=${slug}`;

        const cached = await redis.get(cacheKey);
        
        if(cached){
            return res.json(JSON.parse(cached));
        }

        const event = await prisma.event.findFirst(
            {
                where: {
                    slug: slug,
                    isPublished: true,
                    deletedAt: null
                },
                include: {
                    location: true,
                    organizer: {
                        select: {
                            id: true,
                            email: true
                        }
                    }
                }
            }
        )

        if(!event){
            return res.status(404).json({
                message: "No such event exist"
            });
        }

        await redis.setex(cacheKey, 300, JSON.stringify({event}));

        return res.json({
            event
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getPublicEventById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        if(!id || Array.isArray(id)){
            return res.status(400).json({
                message: "No id provided"
            });
        }

        const event = await prisma.event.findFirst(
            {
                where: {
                    id: id,
                    deletedAt: null
                },
                include: {
                    location: true,
                    organizer: {
                        select: {
                            id: true,
                            email: true
                        }
                    }
                }
            }
        )

        if(!event){
            return res.status(404).json({
                message: "No such event exist"
            });
        }

        return res.json({
            event
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

