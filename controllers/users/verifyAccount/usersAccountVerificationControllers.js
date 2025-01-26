import bcrypt from "bcryptjs";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import IndexError from "../../../middlewares/indexError.js";
import { createSendToken } from "../../../utils/createToken.js";

export const usersAccountVerification = asyncHandler(async (req, res, next) => {
  const { OTP } = req.body;

  // Check if OTP is provided
  if (!OTP) {
    return next(new IndexError("Please provide the OTP", 400));
  }

  // Get the authenticated user
  const user = req.user;

  if (!user) {
    return next(new IndexError("User not found", 404));
  }

  // Ensure the user.OTP exists
  if (!user.OTP) {
    return next(new IndexError("No OTP found for this user", 400));
  }

  // Check if OTP has expired
  if (Date.now() > user.OTPExpires) {
    return next(
      new IndexError("OTP has expired. Please request a new one.", 400)
    );
  }

  // Compare the provided OTP with the hashed OTP in the database
  const isMatch = await bcrypt.compare(OTP, user.OTP);
  if (!isMatch) {
    return next(new IndexError("Invalid OTP. Please try again.", 400));
  }

  // Mark the user's account as verified
  user.isVerified = true;
  user.OTP = undefined; // Remove OTP from the database
  user.OTPExpires = undefined; // Remove expiration time

  await user.save({ validateBeforeSave: false });

  createSendToken(
    user,
    200,
    res,
    "Email verification successful. Your email is now verified."
  );
});
