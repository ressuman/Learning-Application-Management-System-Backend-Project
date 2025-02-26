// Packages
//import path from "path";
import express from "express";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
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
import accountsManagementRoutes from "./routes/admins/accountUserAndAdminManagement/userAndAdminAccountManagementRoutes.js";
import learnerRoutes from "./routes/others/learnerRoutes.js";
import courseRoutes from "./routes/others/courseRoutes.js";
import invoiceRoutes from "./routes/others/invoiceRoutes.js";
import revenueRoutes from "./routes/others/revenueRoutes.js";
import { apiDocumentation } from "./docs/api.js";

dotenv.config();
const port = process.env.PORT_NUMBER || 4200;

const swaggerDocs = apiDocumentation;
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

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
app.use(xss());
app.use(hpp());
app.use(helmet());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Serve static files from the "public" directory
app.use(express.static("public"));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customCss:
      ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
    customCssUrl: CSS_URL,
  })
);

// Routes
// app.get("/", (req, res) => {
//   res.send(`
//     <h1>Welcome to the Auth API</h1>
//     <p><a href="http://localhost:5173">Click here to go to the frontend</a></p>
//     <p><a href="/api/v1/auth/user/google">Login with Google</a></p>
//     <p><a href="/api/v1/auth/user/github">Login with GitHub</a></p>
//   `);
// });

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to G_Client Learning Management System (LMS) API",
    system: {
      name: "G_Client Academy Platform",
      version: "1.0.0",
      description:
        "Comprehensive learning management solution for enterprise training and course administration",
      core_features: [
        "User role management (Admins/Learners)",
        "Course catalog and enrollment system",
        "Learner progress tracking",
        "Financial management with invoicing",
        "Revenue tracking and reporting",
        "Secure authentication (JWT)",
        "Role-based access control",
      ],
    },
    entities_managed: [
      { name: "Learners", endpoints: "/api/v1/learners" },
      { name: "Courses", endpoints: "/api/v1/courses" },
      { name: "Invoices", endpoints: "/api/v1/invoices" },
      { name: "Revenue", endpoints: "/api/v1/revenue" },
    ],
    technical_details: {
      stack: {
        backend: "Node.js/Express",
        database: "MongoDB/Mongoose",
        authentication: "JWT/Bcrypt",
      },
      documentation: {
        swagger: "/api-docs",
        postman_collection: "https://example.com/postman-collection",
      },
      error_handling: {
        standard: "Global error handler with status codes",
        validation: "Joi schema validation",
        logging: "Morgan HTTP request logger",
      },
    },
    status: {
      server: "Operational",
      database: "Connected",
      last_checked: new Date().toISOString(),
      uptime: process.uptime().toFixed(2) + " seconds",
    },
    security_notice: {
      message: "All endpoints require proper authentication",
      required_headers: ["Authorization", "Content-Type"],
      best_practices: [
        "Store tokens securely",
        "Rotate credentials regularly",
        "Follow principle of least privilege",
      ],
    },
    maintenance: {
      monitoring: "Prometheus/Grafana dashboard",
      logging: "Winston logger with daily rotation",
      health_check: "/health",
    },
  });
});

app.get("/profile", (req, res) => {
  res.send(`<h1>Welcome to the Profile Page</h1>{req.user.displayName}`);
});

app.use("/api/v1/auth/user", authUserRoutes);
app.use("/api/v1/otp/user", verifyUserAccountRoutes);
app.use("/api/v1/password/user", passwordUserManagementRoutes);
app.use("/api/v1/profile/user", profileUserManagementRoutes);
app.use("/api/v1/auth/admin", authAdminRoutes);
app.use("/api/v1/otp/admin", verifyAdminAccountRoutes);
app.use("/api/v1/password/admin", passwordAdminManagementRoutes);
app.use("/api/v1/profile/admin", profileAdminManagementRoutes);
app.use("/api/v1/accounts/admin", accountsManagementRoutes);
app.use("/api/v1/learners/admin", learnerRoutes);
app.use("/api/v1/courses/admin", courseRoutes);
app.use("/api/v1/invoices/admin", invoiceRoutes);
app.use("/api/v1/revenues/admin", revenueRoutes);

// Error Handling Middleware
app.all("*", (err, req, res, next) => {
  next(new IndexError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

app.use(errorHandler);

// Start Server
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${port}, and listening to requests at http://localhost:${port}`
  );
});
