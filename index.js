// Packages
//import path from "path";
import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import "./config/passport/passport.js";
//import twilio from "twilio";

// Utilities
import connectDB from "./config/db.js";
import IndexError from "./middlewares/indexError.js";
import errorHandler from "./middlewares/errorHandler.js";
import authUserRoutes from "./routes/users/auth/usersAuthRoutes.js";
import verifyUserAccountRoutes from "./routes/users/verifyAccount/usersAccountVerificationRoutes.js";
import passwordUserManagementRoutes from "./routes/users/passwordManagement/usersPasswordManagementRoutes.js";
import profileUserManagementRoutes from "./routes/users/profileManagement/usersProfileManagementRoutes.js";
import authAdminRoutes from "./routes/admins/auth/adminsAuthRoutes.js";
import verifyAdminAccountRoutes from "./routes/admins/verifyAccount/adminsAccountVerificationRoutes.js";
import passwordAdminManagementRoutes from "./routes/admins/passwordManagement/adminsPasswordManagementRoutes.js";
import profileAdminManagementRoutes from "./routes/admins/profileManagement/adminsProfileManagementRoutes.js";

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

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// // Initialize Twilio
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

app.use(morgan("dev")); // Logging requests
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the "public" directory
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Auth API</h1>
    <p><a href="http://localhost:5173">Click here to go to the frontend</a></p>
    <p><a href="/api/v1/auth/user/google">Login with Google</a></p>
    <p><a href="/api/v1/auth/user/github">Login with GitHub</a></p>
  `);
});

app.get("/profile", (req, res) => {
  res.send(`<h1>Welcome to the Profile Page</h1>{req.user.displayName}`);
});

app.use("/api/v1/auth/user", authUserRoutes);
app.use("/api/v1/auth/user", verifyUserAccountRoutes);
app.use("/api/v1/auth/user", passwordUserManagementRoutes);
app.use("/api/v1/auth/user", profileUserManagementRoutes);
app.use("/api/v1/auth/admin", authAdminRoutes);
app.use("/api/v1/auth/admin", verifyAdminAccountRoutes);
app.use("/api/v1/auth/admin", passwordAdminManagementRoutes);
app.use("/api/v1/auth/admin", profileAdminManagementRoutes);

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
