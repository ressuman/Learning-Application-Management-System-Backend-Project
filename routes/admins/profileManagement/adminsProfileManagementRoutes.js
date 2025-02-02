import express from "express";

import {
  deleteAdminProfile,
  getAdminProfile,
  updateAdminProfile,
} from "../../../controllers/admins/profileManagement/adminsProfileManagementControllers.js";

import { isAdminAuthenticated } from "../../../middlewares/isAuthenticated.js";

import { authorizeRole } from "../../../middlewares/authorizeRole.js";

const router = express.Router();

router.get(
  "/get-profile",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getAdminProfile
);

router.put(
  "/update-profile",
  isAdminAuthenticated,
  authorizeRole("admin"),
  updateAdminProfile
);

router.delete(
  "/delete-profile",
  isAdminAuthenticated,
  authorizeRole("admin"),
  deleteAdminProfile
);

export default router;
