import express from "express";

import {
  adminLogin,
  adminLogout,
  adminSignUp,
} from "../../../controllers/admins/auth/adminsAuthControllers.js";

const router = express.Router();

router.post("/signup", adminSignUp);

router.post("/signin", adminLogin);

router.post("/signout", adminLogout);

export default router;
