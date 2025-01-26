import express from "express";

import { adminsAccountVerification } from "../../../controllers/admins/verifyAccount/adminsAccountVerificationController.js";

import { isAdminAuthenticated } from "../../../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/verify-account", isAdminAuthenticated, adminsAccountVerification);

export default router;
