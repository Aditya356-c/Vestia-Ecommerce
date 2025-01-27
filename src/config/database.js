import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// MongoDB Connection URL
const MONGO_URI = process.env.MONGODB_URI; // or paste your Mongo URI here !

// Connect to Mongodb
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {});

    console.log("[MongoDb] : Connected to MongoDB");
  } catch (error) {
    console.error("[MongoDb Error] :", error);
    process.exit(1);
  }
};

export default connectDB;
