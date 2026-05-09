import {getRedisClient} from "./redisClient.js";

interface RateLimitOptions {
    windowInSeconds : number;
    limit           : number;
    key             : string;
};

export const rateLimiter = async ({key, limit, windowInSeconds}: RateLimitOptions) => {
    const redis = await getRedisClient();

    const currentValue = await redis.incr(key);

    // First request
    if (currentValue === 1) {
        await redis.expire(key, windowInSeconds);
    };

    // Time to live
    const ttl = await redis.ttl(key);

    return {
        success    : currentValue <= limit,
        remaining  : Math.max(0, limit - currentValue),
        retryAfter : ttl
    };
};