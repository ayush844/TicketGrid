import "dotenv/config";

import { connectMongo } from "./config/mongo.js";
import { startLogConsumer } from "./consumer/log.consumer.js";
import { startFlusher } from "./services/logBuffer.service.js";
import { startDLQConsumer } from "./consumer/dlq.consumer.js";



async function startWorker(){
    await connectMongo();
    startFlusher();
    await startLogConsumer();
    await startDLQConsumer();
}


startWorker();