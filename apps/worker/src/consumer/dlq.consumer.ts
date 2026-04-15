import amqp from "amqplib";

export const startLogDLQConsumer = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);

    const channel = await connection.createChannel();
    channel.prefetch(5);

    await channel.assertQueue("failed_logs", {
        durable: true
    });

    console.log("listening for failed logs (DLQ)...");

    channel.consume("failed_logs", async (msg) => {
        if(!msg) return;

        const data = msg.content.toString();

        console.error("Received failed log message from DLQ:", data);

        channel.ack(msg);
    })
}

export const startEmailDLQConsumer = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);

    const channel = await connection.createChannel();
    channel.prefetch(5);

    await channel.assertQueue("failed_emails", {
        durable: true
    });

    console.log("listening for failed emails (DLQ)...");

    channel.consume("failed_emails", async (msg) => {
        if(!msg) return;

        const data = msg.content.toString();

        console.error("Received failed email message from DLQ:", data);

        channel.ack(msg);
    })
}


export const startPaymentDLQConsumer = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);

    const channel = await connection.createChannel();
    channel.prefetch(5);

    await channel.assertQueue("failed_payments", {
        durable: true
    });

    console.log("listening for failed payments (DLQ)...");

    channel.consume("failed_payments", async (msg) => {
        if (!msg) return;

        const data = msg.content.toString();

        console.error("PAYMENT FAILED MESSAGE:", data);

        channel.ack(msg);
    });
};