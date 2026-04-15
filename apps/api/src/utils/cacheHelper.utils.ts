import { redis } from "../config/redis.js"

export const clearListingCache = async () => {
    const keys = await redis.keys("events:*");
    if (keys.length > 0){
        await redis.del(keys);
    }
}

export const invalidateEventCache = async (slug?: string) => {
    try {

        const keys:string[] = [];

        if(slug){
            keys.push(`event:detail:slug=${slug}`);
        }

        const listKeys = await redis.keys("events:*");
        keys.push(...listKeys);

        if(keys.length > 0){
            await redis.del(...keys);
        }

    } catch (error) {
        console.error("cache invalidation failed: ", error);
    }
}