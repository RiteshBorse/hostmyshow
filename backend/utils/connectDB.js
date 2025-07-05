import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb Connected");
        
    } catch (error) {
        console.log("Database connection error" , error)
    }
}
export {connectDB}