import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./utils/connectDB.js";
const app = express();
app.use(express.json());
app.use(cors());
dotenv.configDotenv();

import userRouter from "./routes/user.routes.js"
app.use("/api/user" , userRouter);

app.listen(process.env.PORT || 8000 , ()=> {
    connectDB();
    console.log(`Server listening on ${process.env.PORT || 8000}`)
})
