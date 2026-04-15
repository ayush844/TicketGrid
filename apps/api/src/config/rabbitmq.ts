import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();

    await channel.assertExchange("dlx", "direct", { durable: true });

    await channel.assertQueue("activity_logs", {
        durable: true,
        deadLetterExchange: "dlx",
        deadLetterRoutingKey: "failed_logs"
    });
 
    await channel.assertQueue("failed_logs", { durable: true });
 
    await channel.bindQueue("failed_logs", "dlx", "failed_logs");

    await channel.assertQueue("email_queue", {
        durable: true,
        deadLetterExchange: "dlx",
        deadLetterRoutingKey: "failed_emails"
    });
 
    await channel.assertQueue("failed_emails", { durable: true });
 
    await channel.bindQueue("failed_emails", "dlx", "failed_emails");

    await channel.assertQueue("payment_queue", {
        durable: true,
        deadLetterExchange: "dlx",
        deadLetterRoutingKey: "failed_payments"
    });
 
    await channel.assertQueue("failed_payments", { durable: true });
 
    await channel.bindQueue("failed_payments", "dlx", "failed_payments");
 
    console.log("RabbitMQ connected");
};

export const getChannel = () => {
    if(!channel){
        throw new Error("RabbitMQ not initialized");
    }

    return channel;
}