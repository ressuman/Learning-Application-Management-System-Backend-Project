import express from "express";

import {
  userForgotPassword,
  userResetPassword,
} from "../../../controllers/users/passwordManagement/usersPasswordManagementControllers.js";

const router = express.Router();

router.post("/forgot-password", userForgotPassword);

router.post("/reset-password", userResetPassword);

export default router;
