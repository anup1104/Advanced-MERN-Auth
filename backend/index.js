import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(cors({
  origin: ["http://localhost:5173"], // make this an array to be safe
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());
app.use(cookieParser());

// ✅ NO TYPOS here!
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "frontend", "dist")));
	app.get("/*", (req, res) => {
		res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
	});
}

// 🐞 Helpful: Log all routes for debug
// 🐞 Helpful: Log all routes for debug
app._router?.stack?.forEach((middleware) => {
	if (middleware.route) {
		console.log(`${Object.keys(middleware.route.methods).join(',').toUpperCase()} ${middleware.route.path}`);
	}
});


app.listen(process.env.PORT, () => {
	connectDB();
	console.log("Server is running on", process.env.PORT);
});
