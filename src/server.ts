/* eslint-disable no-console */
import { createServer, Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server=createServer(app)
const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL, {
            serverSelectionTimeoutMS: 10000, 
        });

        mongoose.connection.on("connected", () => {
            console.log("✅ Connected to MongoDB");
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err);
        });

        server = app.listen(envVars.PORT, () => {
            console.log(`🚀 Server is running on port ${envVars.PORT}`);
        });
    } catch (error) {
        console.error("❌ Initial DB connection failed:", error);
    }
};

(async () => {
     await connectRedis()
    await startServer()
    await seedSuperAdmin()
})()

process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})
