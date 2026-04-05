import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();

    await channel.assertExchange("dlx", "fanout", {durable: true});

    await channel.assertQueue("activity_logs", {
        durable: true,
        deadLetterExchange: "dlx"
    });

    await channel.assertQueue("failed_logs", {durable: true});

    await channel.bindQueue("failed_logs", "dlx", "");

    console.log("RabbitMQ connected");
}

export const getChannel = () => {
    if(!channel){
        throw new Error("RabbitMQ not initialized");
    }

    return channel;
}