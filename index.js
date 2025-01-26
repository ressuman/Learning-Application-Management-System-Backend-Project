// Packages
//import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

// Utilities
import connectDB from "./config/db.js";
import IndexError from "./middlewares/indexError.js";
import errorHandler from "./middlewares/errorHandler.js";
import authUserRoutes from "./routes/users/auth/usersAuthRoutes.js";
import verifyUserAccountRoutes from "./routes/users/verifyAccount/usersAccountVerificationRoutes.js";
import authAdminRoutes from "./routes/admins/auth/adminsAuthRoutes.js";
import verifyAdminAccountRoutes from "./routes/admins/verifyAccount/adminsAccountVerificationRoutes.js";

dotenv.config();
const port = process.env.PORT_NUMBER || 4200;

// Database Connection
connectDB();

const app = express();

// Middleware
app.use(helmet()); // Secure HTTP headers

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
); // Configure CORS

app.use(morgan("dev")); // Logging requests
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Serve static files from the "public" directory
app.use(express.static("public"));

// Routes
app.use("/api/v1/auth/user", authUserRoutes);
app.use("/api/v1/auth/user", verifyUserAccountRoutes);
app.use("/api/v1/auth/admin", authAdminRoutes);
app.use("/api/v1/auth/admin", verifyAdminAccountRoutes);

// Error Handling Middleware
app.all("*", (err, req, res) => {
  next(new IndexError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

// Start Server
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${port}, and listening to requests at http://localhost:${port}`
  );
});
