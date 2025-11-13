import mongoose from "mongoose";

/**
 * Check if the database connection is established
 * @returns {boolean} true if database is connected, false otherwise
 */
export const checkDatabaseConnection = () => {
    return mongoose.connection.readyState === 1;
};
