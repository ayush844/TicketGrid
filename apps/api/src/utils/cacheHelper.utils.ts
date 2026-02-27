import { redis } from "../config/redis.js"

export const clearListingCache = async () => {
    const keys = await redis.keys("events:*");
    if (keys.length > 0){
        await redis.del(keys);
    }
}