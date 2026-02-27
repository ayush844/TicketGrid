import Redis from "ioredis";
import { Redis as RedisClass } from "ioredis";

export const redis = new RedisClass(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
});