import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./utils/connectDB.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));
app.use(cookieParser());
dotenv.configDotenv();

import userRouter from "./routes/user.routes.js"
app.use("/api/user" , userRouter);

import eventsRouter from "./routes/events.routes.js"
app.use("/api/events" , eventsRouter);

app.listen(process.env.PORT || 8000 , ()=> {
    connectDB();
    console.log(`Server listening on ${process.env.PORT || 8000}`)
})
