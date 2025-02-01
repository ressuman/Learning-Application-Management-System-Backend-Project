import express from "express";

import {
  adminsAccountVerification,
  adminsResendAccountVerification,
} from "../../../controllers/admins/verifyAccount/adminsAccountVerificationController.js";

import { isAdminAuthenticated } from "../../../middlewares/isAuthenticated.js";
import { authorizeRole } from "../../../middlewares/authorizeRole.js";

const router = express.Router();

router.post(
  "/verify-account",
  isAdminAuthenticated,
  authorizeRole("admin"),
  adminsAccountVerification
);

router.post(
  "/resend-OTP",
  isAdminAuthenticated,
  authorizeRole("admin"),
  adminsResendAccountVerification
);

export default router;
