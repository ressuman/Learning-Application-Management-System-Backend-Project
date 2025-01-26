import express from "express";

import { usersAccountVerification } from "../../../controllers/users/verifyAccount/usersAccountVerificationControllers.js";

import { isUserAuthenticated } from "../../../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/verify-account", isUserAuthenticated, usersAccountVerification);

export default router;
