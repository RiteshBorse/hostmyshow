import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./utils/connectDB.js";
import cookieParser from "cookie-parser";

//Express Setup 
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));
app.use(cookieParser());

//Razorpay Setup 
import Razorpay from "razorpay"
export const razorpayInstance = new Razorpay({
    key_id : process.env.RAZORPAY_KEY,
    key_secret : process.env.RAZORPAY_KEY_SECRET
})

//Gemini Setup
import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiTools } from "./services/gemini/tools.js";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const model = genAI.getGenerativeModel({
    model : "gemini-1.5-flash",
    tools : geminiTools
})

//Routes Setup
import userRouter from "./routes/user.routes.js"
app.use("/api/user" , userRouter);

import eventsRouter from "./routes/events.routes.js"
app.use("/api/events" , eventsRouter);

import paymentRouter from "./routes/payment.routes.js"
app.use("/api/payment" , paymentRouter)

import reviewRouter from "./routes/reveiw.routes.js"
app.use("/api/review" , reviewRouter);

import marketingRouter from "./routes/marketing.routes.js"
app.use("/api/marketing" , marketingRouter)

app.get("/api/start" , (req , res) => {
    return res.status(200).send({
        message : "Server Started",
        success : true
    })
})

//cron file import
import "./cron/updatedEventsStatus.js" 


app.listen(process.env.PORT || 8000 , ()=> {
    connectDB();
    console.log(`Server listening on ${process.env.PORT || 8000}`)
})
