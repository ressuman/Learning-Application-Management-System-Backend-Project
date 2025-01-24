import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  // Set up event listeners before attempting to connect
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB Cluster");
  });

  mongoose.connection.on("error", (error) => {
    console.error("Mongoose connection error:", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
  });

  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Successfully connected to MongoDB Database 👍");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
