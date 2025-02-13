import express from "express";

import {
  adminsAccountVerification,
  adminsResendAccountVerification,
} from "../../../controllers/admins/verifyAccount/adminsAccountVerificationController.js";

const router = express.Router();

router.post("/verify-account", adminsAccountVerification);

router.post("/resend-OTP", adminsResendAccountVerification);

export default router;
