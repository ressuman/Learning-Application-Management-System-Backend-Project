import express from "express";

import {
  adminsAccountVerification,
  adminsResendAccountVerification,
  checkAdminAuth,
} from "../../../controllers/admins/verifyAccount/adminsAccountVerificationController.js";

import { isAdminAuthenticated } from "../../../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/verify-account", adminsAccountVerification);

router.post("/resend-OTP", adminsResendAccountVerification);

router.get("/check-auth", isAdminAuthenticated, checkAdminAuth);

export default router;
