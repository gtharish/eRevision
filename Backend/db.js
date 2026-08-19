import mongoose from "mongoose";

export default async function Connect() {
    try {
       await mongoose.connect(process.env.MongoUrl);
        console.log("MongoDB connected");
    } catch (e) {
        console.error("MongoDB connection failed:", e.message);
    }
}
