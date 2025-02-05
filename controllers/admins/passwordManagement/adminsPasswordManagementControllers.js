import asyncHandler from "../../../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import Admin from "../../../models/users/adminModel.js";
import IndexError from "../../../middlewares/indexError.js";
import { generateOTP } from "../../../utils/generateOTP.js";
import { createSendToken } from "../../../utils/createToken.js";
import sendEmail from "../../../helpers/email.js";

export const adminForgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Validate that the email is provided
  if (!email) {
    return next(new IndexError("Please provide email", 400));
  }

  // Find the admin by email
  const admin = await Admin.findOne({ email });

  // If admin does not exists
  if (!admin) {
    return next(new IndexError("Admin not found", 404));
  }

  // Generate OTP and its hashed version
  const { OTP, hashedOTP } = await generateOTP();
  const OTPExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

  // Save OTP and expiry to the admin document
  admin.resetPasswordOTP = hashedOTP;
  admin.resetPasswordOTPExpires = OTPExpires;

  await admin.save({ validateBeforeSave: false });

  // Create a custom email template
  const emailTemplate = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; padding: 10px 0;">
        <img src="http://localhost:4039/public/gclient-logo" alt="G_Client Logo" style="max-width: 150px; margin-bottom: 20px;" />
      </div>
      <h2 style="color: #0056b3; text-align: center;">Reset Your Password</h2>
      <p style="font-size: 16px;">Dear <strong>${admin.first_name} ${
    admin.last_name
  }</strong>,</p>
      <p style="font-size: 16px;">We received a request to reset your password. Please use the OTP below to proceed with the reset:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 28px; font-weight: bold; color: #0056b3; border: 1px dashed #ddd; padding: 10px 20px; display: inline-block; background-color: #fff;">
          ${OTP}
        </span>
      </div>
      <p style="font-size: 16px; text-align: center;">This OTP is valid for <strong>15 minutes</strong>. Please do not share this OTP with anyone.</p>
      <p style="font-size: 16px;">If you did not request a password reset, you can safely ignore this email. If you encounter any issues, feel free to reach out to our support team.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:support@example.com" style="text-decoration: none; color: #fff; background-color: #0056b3; padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: bold;">Contact Support</a>
      </div>
      <p style="font-size: 14px; text-align: center; color: #888;">If you have any questions, visit our <a href="#" style="color: #0056b3; text-decoration: none;">Help Center</a> or contact us directly.</p>
      <p style="font-size: 14px; text-align: center; color: #888;">Thank you for choosing <strong>${
        process.env.APP_NAME || "G_Client"
      }</strong>.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; text-align: center; color: #aaa;">This email was sent by ${
        process.env.APP_NAME || "G_Client"
      }. Please do not reply to this email.</p>
    </div>
  `;

  try {
    // Send the OTP via email
    await sendEmail({
      email: admin.email,
      subject: "Your OTP for Password Reset (Valid for 5 Minutes)",
      html: emailTemplate,
      message: `Dear ${admin.first_name} ${admin.last_name},\n\nYour OTP for password reset is: ${OTP}. This OTP is valid for 5 minutes. If you did not request this, please ignore this email.\n\nThank you, G_Client Team.`,
    });

    res.status(200).json({
      status: "success",
      message: "OTP sent to your email. Please check your inbox.",
    });
  } catch (error) {
    // Clear OTP fields if email sending fails
    admin.resetPasswordOTP = undefined;
    admin.resetPasswordOTPExpires = undefined;

    await admin.save({ validateBeforeSave: false });

    return next(
      new IndexError("Email could not be sent. Please try again later.", 500)
    );
  }
});

export const adminResetPassword = asyncHandler(async (req, res, next) => {
  const { email, OTP, newPassword, newPasswordConfirm } = req.body;

  // Validate input
  if (!email || !OTP || !newPassword || !newPasswordConfirm) {
    return next(new IndexError("All fields are required", 400));
  }

  if (newPassword !== newPasswordConfirm) {
    return next(new IndexError("Passwords do not match", 400));
  }

  // Find admin by email and retrieve the necessary fields
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return next(new IndexError("Admin not found", 404));
  }

  // Check if the OTP is valid and not expired
  const isOTPValid =
    admin.resetPasswordOTP &&
    (await bcrypt.compare(OTP, admin.resetPasswordOTP)); // Compare OTP with the stored one

  if (!isOTPValid || admin.resetPasswordOTPExpires < Date.now()) {
    return next(new IndexError("Invalid or expired OTP", 400));
  }

  // Update admin password and clear reset-related fields
  admin.password = newPassword;
  admin.passwordConfirm = newPasswordConfirm;
  admin.resetPasswordOTP = undefined;
  admin.resetPasswordOTPExpires = undefined;

  // Save the admin with the updated password and clear OTP fields
  await admin.save();

  // Success response
  // createSendToken(
  //   admin,
  //   200,
  //   res,
  //   "Password reset successful. You can now login with your new password."
  // );

  res.status(200).json({
    status: "success",
    message:
      "Password reset successful. You can now login with your new password.",
  });
});
