import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();

    await channel.assertQueue("activity_logs", {
        durable: true
    });

    console.log("RabbitMQ connected");
}

export const getChannel = () => {
    if(!channel){
        throw new Error("RabbitMQ not initialized");
    }

    return channel;
}