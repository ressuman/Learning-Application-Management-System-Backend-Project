import express from "express";

import {
  adminsAccountVerification,
  adminsResendAccountVerification,
} from "../../../controllers/admins/verifyAccount/adminsAccountVerificationController.js";

import { isAdminAuthenticated } from "../../../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/verify-account", isAdminAuthenticated, adminsAccountVerification);

router.post(
  "/resend-OTP",
  isAdminAuthenticated,
  adminsResendAccountVerification
);

export default router;
