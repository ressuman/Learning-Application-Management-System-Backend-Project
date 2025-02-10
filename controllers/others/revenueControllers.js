import asyncHandler from "../../middlewares/asyncHandler.js";
import IndexError from "../../middlewares/indexError.js";
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

  const revenue = await Revenue.create({ invoiceId, amount });

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

  const revenueEntries = await Revenue.find({
    "revenueEntries.date": {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });

  if (!revenueEntries.length) {
    return next(
      new IndexError(
        "No revenue entries found for the specified date range",
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    message: "Revenue by date range retrieved successfully",
    data: { revenueEntries },
  });
});
