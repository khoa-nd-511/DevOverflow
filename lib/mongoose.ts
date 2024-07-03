import mongoose from "mongoose";

let isConnected = false;

export async function connectToDB() {
    mongoose.set("strictQuery", true);

    if (!process.env.MONGODB_URL) {
        console.log("Missing MONGODB_URL");
        return;
    }

    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "DevOverflow",
        });

        isConnected = true;

        console.log("MongoDB is connected");
    } catch (error) {
        console.log("Failed to connect to MongoDB:DevOverflow");
    }
}
