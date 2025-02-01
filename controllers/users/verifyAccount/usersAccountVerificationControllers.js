import bcrypt from "bcryptjs";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import IndexError from "../../../middlewares/indexError.js";
import { createSendToken } from "../../../utils/createToken.js";
import User from "../../../models/users/userModel.js";
import { generateOTP } from "../../../utils/generateOTP.js";
import dotenv from "dotenv";
import sendEmail from "../../../helpers/email.js";
dotenv.config();

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

  // if the user is already verified
  if (user.isVerified) {
    return next(new IndexError("This user account is already verified", 400));
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

export const usersResendAccountVerification = asyncHandler(
  async (req, res, next) => {
    const { email } = req.user;

    // Check if the email is provided
    if (!email) {
      return next(
        new IndexError("Please provide the email to resend the OTP", 400)
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email });

    if (!user) {
      return next(new IndexError("User not found", 404));
    }

    // If the user is already verified
    if (user.isVerified) {
      return next(new IndexError("This user account is already verified", 400));
    }

    // Generate a new OTP and hash it
    const { OTP, hashedOTP } = await generateOTP();

    // Update user with the new OTP and expiry time
    user.OTP = hashedOTP;
    user.OTPExpires = Date.now() + 15 * 60 * 1000; // Expiry is 15 minutes from now

    await user.save({ validateBeforeSave: false });

    try {
      // Create the email template
      const emailTemplate = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #0056b3; text-align: center;">Resend OTP - Verify Your Email Address</h2>
        <p style="font-size: 16px;">Dear <strong>${user.username}</strong>,</p>
        <p style="font-size: 16px;">We noticed you requested a new OTP. Please use the OTP below to verify your email address:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 28px; font-weight: bold; color: #0056b3; border: 1px dashed #ddd; padding: 10px 20px; display: inline-block; background-color: #fff;">
            ${OTP}
          </span>
        </div>
        <p style="font-size: 16px; text-align: center;">This OTP is valid for <strong>15 minutes</strong>. Please do not share this OTP with anyone.</p>
        <p style="font-size: 14px; text-align: center; color: #888;">Thank you for choosing <strong>${
          process.env.APP_NAME || "G_Client"
        }</strong>.</p>
      </div>
    `;

      // Send the email with the OTP
      await sendEmail({
        email: user.email,
        subject: "Resend OTP - Email Verification (Valid for 15 Minutes)",
        html: emailTemplate,
        message: `Dear ${
          user.username
        },\n\nYour new OTP for email verification is: ${OTP}. This OTP is valid for 15 minutes. If you did not request this, please ignore this email.\n\nBest regards,\nThe ${
          process.env.APP_NAME || "G_Client"
        } Team.`,
      });

      res.status(200).json({
        status: "success",
        message: "A new OTP has been sent to your email address.",
      });
    } catch (error) {
      user.OTP = undefined; // Remove the OTP
      user.OTPExpires = undefined; // Remove the expiration time
      await user.save({ validateBeforeSave: false });

      return next(
        new IndexError("Failed to resend OTP. Please try again later.", 500)
      );
    }
  }
);
