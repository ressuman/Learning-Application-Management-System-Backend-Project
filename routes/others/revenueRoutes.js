import express from "express";

import { isAdminAuthenticated } from "../../middlewares/isAuthenticated.js";

import {
  createRevenue,
  getRevenueAudit,
  getRevenueByDateRange,
  getTotalRevenue,
  voidInvoice,
} from "../../controllers/others/revenueControllers.js";

import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

// Create a new revenue entry (Admin only)
router.post(
  "/create-revenue",
  isAdminAuthenticated,
  authorizeRole("admin"),
  createRevenue
);

// Get total revenue (Admin only)
router.get(
  "/total-revenue",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getTotalRevenue
);

// Get revenue by date range (Admin only)
router.get(
  "/revenue-by-date",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getRevenueByDateRange
);

router.patch(
  "/void-invoice/:invoiceId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  voidInvoice
);

router.get(
  "/audit-log",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getRevenueAudit
);

export default router;
