import express from "express";

import { isAdminAuthenticated } from "../../../middlewares/isAuthenticated.js";

import { authorizeRole } from "../../../middlewares/authorizeRole.js";

import {
  createUserProfile,
  deleteUserProfileByUserId,
  getAllAdmins,
  getAllAdminsAndUsers,
  getAllUsers,
  getUserProfileByUserId,
  updateUserProfileByUserId,
} from "../../../controllers/admins/accountUserAndAdminManagement/userAndAdminAccountManagementControllers.js";

const router = express.Router();

router.post(
  "/create-user-account",
  isAdminAuthenticated,
  authorizeRole("admin"),
  createUserProfile
);

router.get(
  "/get-user-account/:userId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getUserProfileByUserId
);

router.get(
  "/get-all-user-accounts",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getAllUsers
);

router.get(
  "/get-all-admin-accounts",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getAllAdmins
);

router.get(
  "/get-all-accounts",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getAllAdminsAndUsers
);

router.put(
  "/update-user-account/:userId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  updateUserProfileByUserId
);

router.delete(
  "/delete-user-account/:userId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  deleteUserProfileByUserId
);

export default router;
