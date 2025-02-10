import express from "express";

import { isAdminAuthenticated } from "../../middlewares/isAuthenticated.js";

import { authorizeRole } from "../../middlewares/authorizeRole.js";

import {
  createInvoice,
  deleteInvoice,
  getInvoice,
  getInvoices,
  updateInvoice,
} from "../../controllers/others/invoiceControllers.js";

const router = express.Router();

// Create a new invoice (Admin only)
router.post(
  "/create-invoice",
  isAdminAuthenticated,
  authorizeRole("admin"),
  createInvoice
);

// Get all invoices (Admin only)
router.get(
  "/all-invoices",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getInvoices
);

// Get a single invoice by ID (Admin only)
router.get(
  "/get-invoice/:invoiceId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getInvoice
);

// Update invoice details (Admin only)
router.put(
  "/update-invoice/:invoiceId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  updateInvoice
);

// Delete an invoice (Admin only)
router.delete(
  "/delete-invoice/:invoiceId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  deleteInvoice
);

export default router;
