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

import Learner from "../../models/others/learnerModel.js";

import asyncHandler from "../../middlewares/asyncHandler.js";

const router = express.Router();

// Middleware implementation
const checkLearnerCourseRelation = asyncHandler(async (req, res, next) => {
  const learner = await Learner.findById(req.body.learnerId);
  if (!learner.courses.includes(req.body.courseId)) {
    return next(new IndexError("Learner not enrolled in this course", 400));
  }
  next();
});

// Create a new invoice (Admin only)
router.post(
  "/create-invoice",
  isAdminAuthenticated,
  authorizeRole("admin"),
  checkLearnerCourseRelation,
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
