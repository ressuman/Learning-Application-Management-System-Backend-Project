import express from "express";

import {
  deleteAdminProfile,
  getAdminProfile,
  updateAdminProfile,
} from "../../../controllers/admins/profileManagement/adminsProfileManagementControllers.js";

import { isAdminAuthenticated } from "../../../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/get-profile", isAdminAuthenticated, getAdminProfile);

router.put("/update-profile", isAdminAuthenticated, updateAdminProfile);

router.delete("/delete-profile", isAdminAuthenticated, deleteAdminProfile);

export default router;
