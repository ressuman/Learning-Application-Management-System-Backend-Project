import express from "express";
import passport from "passport";
import "../../../config/passport/passport.js";

import {
  adminLogin,
  adminLogout,
  adminSignUp,
  checkAdminAuth,
} from "../../../controllers/admins/auth/adminsAuthControllers.js";

import { createSendToken } from "../../../utils/createToken.js";

import { isAdminAuthenticated } from "../../../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/signup", adminSignUp);

router.post("/signin", adminLogin);

router.get("/check-auth", isAdminAuthenticated, checkAdminAuth);

router.post("/signout", adminLogout);

// Google Auth Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  (req, res) => {
    if (!req.admin) {
      return res.status(401).json({ message: "Admin authentication failed" });
    }

    createSendToken(
      req.admin,
      "admin",
      200,
      res,
      "Logged in successfully with Google"
    );

    res.redirect("http://localhost:5173/dashboard"); // Redirect to frontend
  }
);

// GitHub Auth Route
router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/signin" }),
  (req, res) => {
    if (!req.admin) {
      return res.status(401).json({ message: "Admin authentication failed" });
    }

    createSendToken(
      req.admin,
      "admin",
      200,
      res,
      "Logged in successfully with GitHub"
    );

    res.redirect("http://localhost:5173/dashboard"); // Redirect to frontend
  }
);

// Logout Route
router.get("/signout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.redirect("/signin");
  });

  next();
});

export default router;
