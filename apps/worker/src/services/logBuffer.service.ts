import { ActivityLog } from "../models/activityLog.model.js";


const buffer: any[] = [];

const BATCH_SIZE = 20;
const FLUSH_INTERVAL = 5000;

export const addLogToBuffer = (log: any) => {
    buffer.push(log);

    if(buffer.length >= BATCH_SIZE){
        flushLogs();
    }
}

export const flushLogs = async () => {
    if(buffer.length == 0){
        return;
    }

    const logs = buffer.splice(0, buffer.length);

    try {
        await ActivityLog.insertMany(logs);
        console.log(`Inserted ${logs.length} logs`);
    } catch (error) {
        console.error("Failed to insert logs", error);
    }
}

export const startFlusher = () => {
    setInterval(flushLogs, FLUSH_INTERVAL);
}