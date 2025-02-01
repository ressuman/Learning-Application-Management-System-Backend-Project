import express from "express";

import {
  usersAccountVerification,
  usersResendAccountVerification,
} from "../../../controllers/users/verifyAccount/usersAccountVerificationControllers.js";

import { isUserAuthenticated } from "../../../middlewares/isAuthenticated.js";
import { authorizeRole } from "../../../middlewares/authorizeRole.js";

const router = express.Router();

router.post(
  "/verify-account",
  isUserAuthenticated,
  authorizeRole("user"),
  usersAccountVerification
);

router.post(
  "/resend-OTP",
  isUserAuthenticated,
  authorizeRole("user"),
  usersResendAccountVerification
);

export default router;
