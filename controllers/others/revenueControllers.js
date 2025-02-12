import asyncHandler from "../../middlewares/asyncHandler.js";
import IndexError from "../../middlewares/indexError.js";
import Invoice from "../../models/others/invoiceModel.js";
import Revenue from "../../models/others/revenueModel.js";

/**
 * @desc Create revenue entry (Admin only)
 * @route POST /api/v1/revenue/create-revenue
 * @access Private (Admin)
 */
export const createRevenue = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  if (!admin) {
    return next(
      new IndexError(
        "Access denied. Only admins can create revenue records.",
        403
      )
    );
  }

  const { invoiceId, amount } = req.body;

  // Validate required fields
  if (!invoiceId || !amount) {
    return next(new IndexError("Invoice ID and amount are required", 400));
  }

  // Validate invoice exists
  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    return next(new IndexError("Invoice not found", 404));
  }

  const revenue = await Revenue.findOneAndUpdate(
    {},
    {
      $inc: { totalRevenue: amount },
      $push: {
        invoices: invoiceId,
        revenueEntries: { amount, date: Date.now() },
      },
    },
    { upsert: true, new: true }
  );

  res.status(201).json({
    success: true,
    message: "Revenue recorded successfully",
    data: { revenue },
  });
});

/**
 * @desc    Get total revenue (Admin only)
 * @route   GET /api/v1/revenue/total-revenue
 * @access  Private (Admin)
 */
export const getTotalRevenue = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only an admin can view total revenue
  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can view total revenue.", 403)
    );
  }

  const revenue = await Revenue.findOne();

  if (!revenue) {
    return next(new IndexError("Revenue data not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Total revenue retrieved successfully",
    data: { totalRevenue: revenue.totalRevenue },
  });
});

/**
 * @desc    Get revenue by date range (Admin only)
 * @route   GET /api/v1/revenue/revenue-by-date
 * @access  Private (Admin)
 */
export const getRevenueByDateRange = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only an admin can view revenue by date range
  if (!admin) {
    return next(
      new IndexError(
        "Access denied. Only admins can view revenue by date range.",
        403
      )
    );
  }

  const { startDate, endDate } = req.query;

  // Validate date range
  if (!startDate || !endDate) {
    return next(new IndexError("Start date and end date are required", 400));
  }

  const revenue = await Revenue.aggregate([
    { $unwind: "$revenueEntries" },
    {
      $match: {
        "revenueEntries.date": {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$revenueEntries.amount" },
        entries: { $push: "$revenueEntries" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "Revenue by date range retrieved successfully",
    data: {
      totalRevenue: revenue[0]?.total || 0,
      entries: revenue[0]?.entries || [],
    },
  });
});

/**
 * @desc    Void an invoice and adjust revenue (Admin only)
 * @route   PATCH /api/v1/revenue/void-invoice/:invoiceId
 * @access  Private (Admin)
 */
export const voidInvoice = asyncHandler(async (req, res, next) => {
  const { invoiceId } = req.params;

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    return next(new IndexError("Invoice not found", 404));
  }

  if (invoice.status === "Paid") {
    // Subtract from revenue
    await Revenue.updateOne(
      {},
      {
        $inc: { totalRevenue: -invoice.amount },
        $pull: { invoices: invoiceId },
      }
    );
  }

  invoice.status = "Voided";
  await invoice.save();

  res.status(200).json({
    success: true,
    message: "Invoice voided and revenue adjusted",
    data: { invoice },
  });
});

/**
 * @desc    Get full revenue audit log (Admin only)
 * @route   GET /api/v1/revenue/audit-log
 * @access  Private (Admin)
 */
export const getRevenueAudit = asyncHandler(async (req, res, next) => {
  const revenue = await Revenue.find().populate({
    path: "invoices",
    populate: { path: "learnerId courseId" },
  });

  res.status(200).json({
    success: true,
    results: revenue.length,
    data: { revenue },
  });
});
