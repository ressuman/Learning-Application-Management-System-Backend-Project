import express from "express";

import { userSignUp } from "../../../controllers/users/auth/usersAuthControllers.js";

const router = express.Router();

router.post("/signup", userSignUp);

// router.post("/signin", loginUser);

// router.post("/signout", logoutUser);

export default router;
