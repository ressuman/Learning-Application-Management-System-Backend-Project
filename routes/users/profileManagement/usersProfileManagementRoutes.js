import express from "express";

import {
  deleteUserProfile,
  getUserProfile,
  updateUserProfile,
} from "../../../controllers/users/profileManagement/usersProfileManagementControllers.js";

import { isUserAuthenticated } from "../../../middlewares/isAuthenticated.js";

import { authorizeRole } from "../../../middlewares/authorizeRole.js";

const router = express.Router();

router.get(
  "/get-profile",
  isUserAuthenticated,
  authorizeRole("user"),
  getUserProfile
);

router.put(
  "/update-profile",
  isUserAuthenticated,
  authorizeRole("user"),
  updateUserProfile
);

router.delete(
  "/delete-profile",
  isUserAuthenticated,
  authorizeRole("user"),
  deleteUserProfile
);

export default router;
