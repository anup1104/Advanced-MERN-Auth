import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.routes.js"
import cors from "cors"
dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URI || "http://localhost:5173", // replace with your frontend origin
  credentials: true // required for cookies (when using cookie-based auth)
}));
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)

app.listen(process.env.PORT, ()=>{
    connectDB()
    console.log("Server is running on ", process.env.PORT);
})
