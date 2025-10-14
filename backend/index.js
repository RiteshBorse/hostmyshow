import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./utils/connectDB.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

//Express Setup 
dotenv.config();
const app = express();
app.use(express.json());
const allowOrigin = [
    process.env.CLIENT_URL,
    process.env.SERVER_URL
]
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
    model : "gemini-2.0-flash",
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

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join event room for seat updates
    socket.on('join-event', (eventId) => {
        socket.join(`event-${eventId}`);
        console.log(`User ${socket.id} joined event ${eventId}`);
    });

    // Leave event room
    socket.on('leave-event', (eventId) => {
        socket.leave(`event-${eventId}`);
        console.log(`User ${socket.id} left event ${eventId}`);
    });

    // Handle seat selection
    socket.on('select-seat', async (data) => {
        const { eventId, seatLabel, userId } = data;
        try {
            // Emit seat selection to all users in the event room
            socket.to(`event-${eventId}`).emit('seat-selected', {
                seatLabel,
                userId,
                timestamp: new Date()
            });
        } catch (error) {
            socket.emit('seat-selection-error', { error: error.message });
        }
    });

    // Handle seat deselection
    socket.on('deselect-seat', (data) => {
        const { eventId, seatLabel, userId } = data;
        socket.to(`event-${eventId}`).emit('seat-deselected', {
            seatLabel,
            userId,
            timestamp: new Date()
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Export io for use in other files
export { io };

server.listen(process.env.PORT || 8000 , ()=> {
    connectDB();
    console.log(`Server listening on ${process.env.PORT || 8000}`)
})
