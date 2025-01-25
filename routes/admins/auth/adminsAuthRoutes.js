import express from "express";

import { adminSignUp } from "../../../controllers/admins/auth/adminsAuthControllers.js";

const router = express.Router();

router.post("/signup", adminSignUp);

// router.post("/signin", loginUser);

// router.post("/signout", logoutUser);

export default router;
