import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./utils/connectDB.js";
import cookieParser from "cookie-parser";
dotenv.configDotenv();
const app = express();

import Razorpay from "razorpay"
export const razorpayInstance = new Razorpay({
    key_id : process.env.RAZORPAY_KEY,
    key_secret : process.env.RAZORPAY_KEY_SECRET
})
app.use(express.json());
app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials : true
}));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js"
app.use("/api/user" , userRouter);

import eventsRouter from "./routes/events.routes.js"
app.use("/api/events" , eventsRouter);

import paymentRouter from "./routes/payment.routes.js"
app.use("/api/payment" , paymentRouter)

app.listen(process.env.PORT || 8000 , ()=> {
    connectDB();
    console.log(`Server listening on ${process.env.PORT || 8000}`)
})
