import * as amqp from "amqplib";
let channel;
let connection;
let initializing = null;
export const loginPublisher = async () => {
    try {
        if (channel)
            return channel;
        if (initializing)
            return initializing;
        initializing = (async () => {
            if (!process.env.RABBITMQ_URL) {
                throw new Error("RABBITMQ_URL is not defined.");
            }
            ;
            connection = await amqp.connect(process.env.RABBITMQ_URL);
            channel = await connection.createChannel();
            await channel.assertExchange("auth.events", "topic", {
                durable: true
            });
            console.log("RabbitMQ publisher ready..");
            return channel;
        })();
        return await initializing;
    }
    catch (err) {
        console.error("Failed to initialize rabbitMQ publisher:", err);
        throw err;
    }
    ;
};
