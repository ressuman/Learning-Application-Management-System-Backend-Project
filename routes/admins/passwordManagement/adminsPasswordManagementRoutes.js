import express from "express";

import {
  adminForgotPassword,
  adminResetPassword,
} from "../../../controllers/admins/passwordManagement/adminsPasswordManagementControllers.js";

const router = express.Router();

router.post("/forgot-password", adminForgotPassword);

router.post("/reset-password", adminResetPassword);

export default router;
