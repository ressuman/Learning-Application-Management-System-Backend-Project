import asyncHandler from "../../../middlewares/asyncHandler.js";
import IndexError from "../../../middlewares/indexError.js";

export const usersAccountVerification = asyncHandler(async (req, res, next) => {
  const { OTP } = req.body;

  // Check if OTP is provided
  if (!OTP) {
    return next(new IndexError("Please provide the OTP", 400));
  }

  // Find the user by email
});
