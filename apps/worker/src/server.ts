import "dotenv/config";

import { connectMongo } from "./config/mongo.js";
import { startLogConsumer } from "./consumer/log.consumer.js";
import { startFlusher } from "./services/logBuffer.service.js";
import { startEmailDLQConsumer, startLogDLQConsumer } from "./consumer/dlq.consumer.js";
import { startEmailConsumer } from "./consumer/email.consumer.js";



async function startWorker(){
    await connectMongo();
    startFlusher();

    await startLogConsumer();
    await startLogDLQConsumer();

    await startEmailConsumer();
    await startEmailDLQConsumer();
}


startWorker();