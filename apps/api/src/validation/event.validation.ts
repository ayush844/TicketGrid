import {z} from 'zod';

export const createEventSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),

    capacity: z.coerce.number().int().positive(),

    tags: z.array(
        z.enum([
            "MUSIC",
            "TECH",
            "SPORTS",
            "WORKSHOP",
            "BUSINESS",
            "ART",
            "COMMUNITY",
            "OTHERS"
        ])
    ).max(3),

    location: z.object({
        country: z.string().min(2),
        state: z.string().min(2),
        city: z.string().min(2),
        postalCode: z.string().optional(),
        addressLine: z.string().min(3)
    }),

    imageUrl: z.url().optional()

})


export const updateEventSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),

    capacity: z.coerce.number().int().positive().optional(),

    tags: z.array(
        z.enum([
            "MUSIC",
            "TECH",
            "SPORTS",
            "WORKSHOP",
            "BUSINESS",
            "ART",
            "COMMUNITY",
            "OTHERS"
        ])
    ).max(3).optional(),

    location: z.object({
        country: z.string().min(2).optional(),
        state: z.string().min(2).optional(),
        city: z.string().min(2).optional(),
        postalCode: z.string().optional(),
        addressLine: z.string().min(3).optional()
    }).optional(),

    imageUrl: z.url().optional()

})