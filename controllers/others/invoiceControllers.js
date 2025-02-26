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

  const {
    learnerId,
    courseId,
    amount,
    description,
    dueDate,
    status,
    installmentPlan,
  } = req.body;

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
  const learner = await Learner.findById(learnerId)
    .populate("courses")
    .populate({
      path: "discounts.courses.course",
      model: "Course",
    });

  if (!learner) {
    return next(new IndexError("Learner not found", 404));
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new IndexError("Course not found", 404));
  }

  // Calculate fees
  const regDiscount = learner.discounts.registration / 100;
  const regFee = learner.registrationFee * (1 - regDiscount);

  const courseDiscount =
    learner.discounts.courses.find((d) => d.course._id.equals(courseId))
      ?.discount || 0;

  const courseFee = course.basePrice * (1 - courseDiscount / 100);
  const totalAmount = regFee + courseFee;

  // Create installments
  const installmentAmount = totalAmount / installmentPlan;
  const installments = Array.from({ length: installmentPlan }, (_, i) => ({
    dueDate: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000),
    amount: installmentAmount,
    status: "Pending",
  }));

  // Create a new invoice
  const invoice = new Invoice({
    learnerId,
    courseId,
    amount: totalAmount,
    installmentPlan,
    installments,
    totalAmount,
    discountApplied: regDiscount + courseDiscount,
    remainingBalance: totalAmount,
    description,
    dueDate: installments[installments.length - 1].dueDate,
    status,
  });

  // Update learner balance
  learner.balance = totalAmount;
  await invoice.save();

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

  const { status } = req.query;
  const filter = status ? { status } : {};

  // Pagination setup
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const invoices = await Invoice.find(filter)
    .populate({
      path: "learnerId",
      populate: { path: "user" },
    })
    .populate("courseId")
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

  const invoice = await Invoice.findById(invoiceId).populate(
    "learnerId courseId"
  );

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

  // Validate learner and course exist if provided
  if (learnerId) {
    const learner = await Learner.findById(learnerId);
    if (!learner) {
      return next(new IndexError("Learner not found", 404));
    }
  }

  if (courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new IndexError("Course not found", 404));
    }
  }

  if (learnerId && courseId) {
    const learner = await Learner.findById(learnerId);
    if (!learner.courses.includes(courseId)) {
      return next(new IndexError("Learner not enrolled in course", 400));
    }
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

  await invoice.findByIdAndUpdate(
    invoiceId,
    { isDeleted: true },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Invoice deleted successfully",
    data: null,
  });
});
