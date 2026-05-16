import { createClient } from "redis";
let client = null;
export const getRedisClient = async () => {
    if (client && client.isOpen) {
        return client;
    }
    ;
    client = createClient({
        url: process.env.REDIS_URL
    });
    client.on("Error", (err) => {
        console.error("Redis Error", err);
    });
    await client.connect();
    return client;
};
