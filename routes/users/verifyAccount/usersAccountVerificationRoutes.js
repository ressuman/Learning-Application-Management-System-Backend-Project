import express from "express";

import {
  checkUserAuth,
  resendOTPForAdminCreatedProfile,
  usersAccountVerification,
  usersResendAccountVerification,
  verifyOTPForAdminCreatedProfile,
} from "../../../controllers/users/verifyAccount/usersAccountVerificationControllers.js";

import { isUserAuthenticated } from "../../../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/verify-account/user", usersAccountVerification);

router.post("/resend-OTP/user", usersResendAccountVerification);

router.get("/check-auth", isUserAuthenticated, checkUserAuth);

// Verify OTP for admin-created profile
router.post("/verify-account/admin", verifyOTPForAdminCreatedProfile);

// Resend OTP for admin-created profile
router.post("/resend-OTP/admin", resendOTPForAdminCreatedProfile);

export default router;
