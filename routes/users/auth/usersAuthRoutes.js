import express from "express";
import passport from "passport";
import "../../../config/passport/passport.js";

import {
  userLogin,
  userLogout,
  userSignUp,
} from "../../../controllers/users/auth/usersAuthControllers.js";

import { createSendToken } from "../../../utils/createToken.js";

const router = express.Router();

router.post("/signup", userSignUp);

router.post("/signin", userLogin);

router.post("/signout", userLogout);

// Google Auth Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "User authentication failed" });
    }

    createSendToken(
      req.user,
      "user",
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
    if (!req.user) {
      return res.status(401).json({ message: "User authentication failed" });
    }

    createSendToken(
      req.user,
      "user",
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
