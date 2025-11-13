import dotenv from "dotenv";
import mongoose from "mongoose";
import { checkDatabaseConnection } from "../utils/dbStatus.js";
import { connectDB } from "../utils/connectDB.js";

// Load environment variables before tests
dotenv.config();

describe("Database Connection Tests", () => {
    beforeAll(async () => {
        // Ensure database connection is established before tests
        await connectDB();
        // Add a small delay to ensure connection is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    afterAll(async () => {
        // Close database connection after all tests
        await mongoose.connection.close();
    });

    test("checkDatabaseConnection should return true when database is connected", () => {
        const isConnected = checkDatabaseConnection();
        expect(isConnected).toBe(true);
    });
});
