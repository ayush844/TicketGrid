import mongoose from "mongoose";


export const connectMongo = async () => {
    try {
        if(!process.env.MONGO_URI){
            throw new Error("MONGO URI not defined");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error: ", error);
        process.exit(1);
    }
}