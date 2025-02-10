import asyncHandler from "../../middlewares/asyncHandler.js";
import IndexError from "../../middlewares/indexError.js";
import Course from "../../models/others/courseModel.js";
import Invoice from "../../models/others/invoiceModel.js";
import Learner from "../../models/others/learnerModel.js";

/**
 * @desc    Create a new invoice (Admin only)
 * @route   POST /api/v1/invoices/create-invoice
 * @access  Private (Admin)
 */
export const createInvoice = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only an admin can create an invoice
  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can create invoices.", 403)
    );
  }

  const { learnerId, courseId, amount, description, dueDate, status } =
    req.body;

  // Validate required fields
  if (!learnerId || !courseId || !amount || !dueDate || !status) {
    return next(
      new IndexError(
        "Learner ID, Course ID, Amount, Due Date, and Status are required.",
        400
      )
    );
  }

  // Validate learner and course exists
  const learner = await Learner.findById(learnerId);

  if (!learner) {
    return next(new IndexError("Learner not found", 404));
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new IndexError("Course not found", 404));
  }

  // Create a new invoice
  const invoice = await Invoice.create({
    learner: learnerId,
    course: courseId,
    amount,
    description,
    dueDate,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Invoice created successfully",
    data: { invoice },
  });
});

/**
 * @desc    Get all invoices (Admin only)
 * @route   GET /api/v1/invoices/all-invoices
 * @access  Private (Admin)
 */
export const getInvoices = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only an admin can view all invoices
  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can view all invoices.", 403)
    );
  }

  // Pagination setup
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const invoices = await Invoice.find()
    .populate("learner course")
    .skip(skip)
    .limit(limit);

  const totalInvoices = await Invoice.countDocuments();

  res.status(200).json({
    success: true,
    message: "Invoices retrieved successfully",
    results: invoices.length,
    totalInvoices,
    currentPage: page,
    totalPages: Math.ceil(totalInvoices / limit),
    data: { invoices },
  });
});

/**
 * @desc    Get a single invoice by ID (Admin only)
 * @route   GET /api/v1/invoices/get-invoice/:invoiceId
 * @access  Private (Admin)
 */
export const getInvoice = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only authenticated admin can view an invoice
  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can view invoices.", 403)
    );
  }

  const { invoiceId } = req.params;

  // Validate invoice ID
  if (!invoiceId) {
    return next(new IndexError("Invoice ID is required", 400));
  }

  const invoice = await Invoice.findById(invoiceId).populate("learner course");

  if (!invoice) {
    return next(new IndexError("Invoice not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Invoice retrieved successfully",
    data: { invoice },
  });
});

/**
 * @desc    Update invoice details (Admin only)
 * @route   PUT /api/v1/invoices/update-invoice/:invoiceId
 * @access  Private (Admin)
 */
export const updateInvoice = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only an admin can update an invoice
  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can update invoices.", 403)
    );
  }

  const { invoiceId } = req.params;

  const { learnerId, courseId, amount, description, dueDate, status } =
    req.body;

  // Validate invoice ID
  if (!invoiceId) {
    return next(new IndexError("Invoice ID is required", 400));
  }

  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    return next(new IndexError("Invoice not found", 404));
  }

  // Update invoice details
  if (learnerId) {
    invoice.learnerId = learnerId;
  }
  if (courseId) {
    invoice.courseId = courseId;
  }
  if (amount) {
    invoice.amount = amount;
  }
  if (description) {
    invoice.description = description;
  }
  if (dueDate) {
    invoice.dueDate = dueDate;
  }
  if (status) {
    invoice.status = status;
  }

  const updatedInvoice = await invoice.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "Invoice updated successfully",
    data: { updatedInvoice },
  });
});

/**
 * @desc    Delete an invoice (Admin only)
 * @route   DELETE /api/v1/invoices/delete-invoice/:invoiceId
 * @access  Private (Admin)
 */
export const deleteInvoice = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only an admin can delete an invoice
  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can delete invoices.", 403)
    );
  }

  const { invoiceId } = req.params;

  // Validate invoice ID
  if (!invoiceId) {
    return next(new IndexError("Invoice ID is required", 400));
  }

  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    return next(new IndexError("Invoice not found", 404));
  }

  await invoice.deleteOne();

  res.status(200).json({
    success: true,
    message: "Invoice deleted successfully",
    data: null,
  });
});
