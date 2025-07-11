import mongoose from "mongoose";
export const connectDB = async () => {
	try {
        
		const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected")
	} catch(error) {
        console.log("Failed to connect to Database", error);
        process.exit(1);
    }
};
