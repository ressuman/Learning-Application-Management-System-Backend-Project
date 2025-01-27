import express from "express";

import {
  usersAccountVerification,
  usersResendAccountVerification,
} from "../../../controllers/users/verifyAccount/usersAccountVerificationControllers.js";

import { isUserAuthenticated } from "../../../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/verify-account", isUserAuthenticated, usersAccountVerification);

router.post("/resend-OTP", isUserAuthenticated, usersResendAccountVerification);

export default router;
