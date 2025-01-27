import express from "express";

import {
  userLogin,
  userLogout,
  userSignUp,
} from "../../../controllers/users/auth/usersAuthControllers.js";

const router = express.Router();

router.post("/signup", userSignUp);

router.post("/signin", userLogin);

router.post("/signout", userLogout);

export default router;
