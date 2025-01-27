import express from "express";

import {
  deleteUserProfile,
  getUserProfile,
  updateUserProfile,
} from "../../../controllers/users/profileManagement/usersProfileManagementControllers.js";

import { isUserAuthenticated } from "../../../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/get-profile", isUserAuthenticated, getUserProfile);

router.put("/update-profile", isUserAuthenticated, updateUserProfile);

router.delete("/delete-profile", isUserAuthenticated, deleteUserProfile);

export default router;
