import express from "express";

import {
  resendOTPForAdminCreatedProfile,
  usersAccountVerification,
  usersResendAccountVerification,
  verifyOTPForAdminCreatedProfile,
} from "../../../controllers/users/verifyAccount/usersAccountVerificationControllers.js";

const router = express.Router();

router.post("/verify-account/user", usersAccountVerification);

router.post("/resend-OTP/user", usersResendAccountVerification);

// Verify OTP for admin-created profile
router.post("/verify-account/admin", verifyOTPForAdminCreatedProfile);

// Resend OTP for admin-created profile
router.post("/resend-OTP/admin", resendOTPForAdminCreatedProfile);

export default router;
