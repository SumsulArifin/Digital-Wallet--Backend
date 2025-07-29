/* eslint-disable no-console */
import { createServer, Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

// let server: Server;
let server=createServer(app)
const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL, {
            serverSelectionTimeoutMS: 10000, // Wait 10s before timeout
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


// const startServer = async () => {
//     try {
//         await mongoose.connect(envVars.DB_URL)

//         console.log("Connected to DB!!");

//         server = app.listen(envVars.PORT, () => {
//             console.log(`Server is listening to port ${envVars.PORT}`);
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }

(async () => {
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

// Unhandler rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// Uncaught Exception Error
// throw new Error("I forgot to handle this local erro")


/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */

