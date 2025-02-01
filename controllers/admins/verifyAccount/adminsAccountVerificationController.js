import bcrypt from "bcryptjs";
import sendEmail from "../../../helpers/email.js";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import IndexError from "../../../middlewares/indexError.js";
import Admin from "../../../models/users/adminModel.js";
import { generateOTP } from "../../../utils/generateOTP.js";
import dotenv from "dotenv";
import { createSendToken } from "../../../utils/createToken.js";
dotenv.config();

export const adminsAccountVerification = asyncHandler(
  async (req, res, next) => {
    const { OTP } = req.body;

    // Check if OTP is provided
    if (!OTP) {
      return next(new IndexError("Please provide the OTP", 400));
    }

    // Get the authenticated admin
    const admin = req.admin;

    if (!admin) {
      return next(new IndexError("Admin not found", 404));
    }

    // If the admin is already verified
    if (admin.isVerified) {
      return next(
        new IndexError("This admin account is already verified", 400)
      );
    }

    // Ensure the admin.OTP exists
    if (!admin.OTP) {
      return next(new IndexError("No OTP found for this admin", 400));
    }

    // Check if OTP has expired
    if (Date.now() > admin.OTPExpires) {
      return next(
        new IndexError("OTP has expired. Please request a new one.", 400)
      );
    }

    // Compare the provided OTP with the hashed OTP in the database
    const isMatch = await bcrypt.compare(OTP, admin.OTP);

    if (!isMatch) {
      return next(new IndexError("Invalid OTP. Please try again.", 400));
    }

    // Mark the admin's account as verified
    admin.isVerified = true;
    admin.OTP = undefined; // Remove OTP from the database
    admin.OTPExpires = undefined; // Remove expiration time

    await admin.save({ validateBeforeSave: false });

    createSendToken(
      admin,
      200,
      res,
      "Email verification successful. Your email is now verified."
    );
  }
);

export const adminsResendAccountVerification = asyncHandler(
  async (req, res, next) => {
    const { email } = req.admin;

    // Check if email is provided
    if (!email) {
      return next(
        new IndexError("Please provide an email to resend the OTP", 400)
      );
    }

    // Find the admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return next(new IndexError("Admin not found", 404));
    }

    // If the admin is already verified
    if (admin.isVerified) {
      return next(
        new IndexError("This admin account is already verified", 400)
      );
    }

    // Generate a new OTP
    const { OTP, hashedOTP } = await generateOTP();

    // Update the admin's OTP and OTPExpires
    admin.OTP = hashedOTP;
    admin.OTPExpires = new Date(Date.now() + 15 * 60 * 1000);

    await admin.save({ validateBeforeSave: false });

    // Create a custom email template
    const emailTemplate = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #0056b3; text-align: center;">Resend OTP - Verify Your Email Address</h2>
        <p style="font-size: 16px;">Dear <strong>${admin.first_name} ${
      admin.last_name
    }</strong>,</p>
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

    // Send the email
    try {
      await sendEmail({
        email: admin.email,
        subject: "Resend OTP - Email Verification (Valid for 15 Minutes)",
        html: emailTemplate,
        message: `Dear ${
          admin.first_name + " " + admin.last_name
        },\n\nYour new OTP for email verification is: ${OTP}. This OTP is valid for 15 minutes. If you did not request this, please ignore this email.\n\nBest regards,\nThe ${
          process.env.APP_NAME || "G_Client"
        } Team.`,
      });

      res.status(200).json({
        status: "success",
        message: "A new OTP has been sent to your email address.",
      });
    } catch (error) {
      admin.OTP = undefined;
      admin.OTPExpires = undefined;

      await admin.save({ validateBeforeSave: false });

      return next(new IndexError("Email could not be sent", 500));
    }
  }
);
