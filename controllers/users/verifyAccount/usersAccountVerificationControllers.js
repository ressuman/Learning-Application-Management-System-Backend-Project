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
  const { email, OTP } = req.body;

  // Check if OTP is provided
  if (!email || !OTP) {
    return next(new IndexError("Please provide both email and OTP", 400));
  }

  const user = await User.findOne({ email });

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
    "Email verification successful. Your email is now verified. This user account has been activated."
  );
});

export const usersResendAccountVerification = asyncHandler(
  async (req, res, next) => {
    const { email } = req.body;

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

// Verify OTP for admin-created profile
export const verifyOTPForAdminCreatedProfile = asyncHandler(
  async (req, res, next) => {
    const { email, OTP } = req.body;

    // Check if email and OTP are provided
    if (!email || !OTP) {
      return next(new IndexError("Email and OTP are required", 400));
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If the user doesn't exist, return an error
    if (!user) {
      return next(new IndexError("User not found", 404));
    }

    if (user.isVerified) {
      return next(new IndexError("Account already verified", 400));
    }

    // Ensure the user.OTP exists
    if (!user.OTP) {
      return next(new IndexError("No OTP found for this user", 400));
    }

    // Check if the OTP has expired
    if (user.OTPExpires < Date.now()) {
      return next(
        new IndexError("OTP has expired. Please request a new one.", 400)
      );
    }

    // Verify the OTP
    const isOTPValid = await bcrypt.compare(OTP, user.OTP);

    if (!isOTPValid) {
      return next(new IndexError("Invalid OTP. Please try again", 400));
    }

    // Activate the account
    user.isVerified = true;
    user.OTP = undefined;
    user.OTPExpires = undefined;

    // Save the updated user
    await user.save({ validateBeforeSave: false });

    // Send the response
    // res.status(200).json({
    //   status: "success",
    //   message: "Account verified successfully. You can now log in.",
    //   data: {
    //     user: {
    //       _id: user._id,
    //       username: user.username,
    //       email: user.email,
    //       isVerified: user.isVerified,
    //     },
    //   },
    // });
    createSendToken(
      user,
      200,
      res,
      "Your user account verified successfully. You can now log in."
    );
  }
);

// Resend OTP for admin-created profile
export const resendOTPForAdminCreatedProfile = asyncHandler(
  async (req, res, next) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return next(new IndexError("Email is required", 400));
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If the user doesn't exist, return an error
    if (!user) {
      return next(new IndexError("User not found", 404));
    }

    // Ensure the account is not already verified
    if (user.isVerified) {
      return next(new IndexError("Account already verified", 400));
    }

    // Generate a new OTP and hashed OTP
    const { OTP, hashedOTP } = await generateOTP();

    // Set OTP expiration time (15 minutes from now)
    const OTPExpires = Date.now() + 15 * 60 * 1000;

    // Update the user's OTP and OTP expiration time
    user.OTP = hashedOTP;
    user.OTPExpires = OTPExpires;

    // Save the updated user
    await user.save({ validateBeforeSave: false });

    // Send the new OTP via email
    const emailTemplate = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #0056b3; text-align: center;">New OTP for Account Verification</h2>
        <p style="font-size: 16px;">Dear <strong>${user.username}</strong>,</p>
        <p style="font-size: 16px;">A new OTP has been generated for your account verification. Please use the OTP below to verify your email address:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 28px; font-weight: bold; color: #0056b3; border: 1px dashed #ddd; padding: 10px 20px; display: inline-block; background-color: #fff;">
            ${OTP}
          </span>
        </div>
        <p style="font-size: 16px; text-align: center;">This OTP is valid for <strong>15 minutes</strong>. Please do not share this OTP with anyone.</p>
        <p style="font-size: 14px; text-align: center; color: #888;">If you did not request this OTP, please ignore this email or contact support.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "New OTP for Account Verification",
        html: emailTemplate,
        message: `Dear ${
          user.username
        },\n\nA new OTP has been generated for your account verification. Please use the OTP below to verify your email address:\n\nOTP: ${OTP}\n\nThis OTP is valid for 15 minutes.\n\nIf you did not request this OTP, please ignore this email or contact support.\n\nBest regards,\nThe ${
          process.env.APP_NAME || "G_Client"
        } Team.`,
      });

      res.status(200).json({
        status: "success",
        message: "A new OTP has been sent to your email.",
      });
    } catch (error) {
      user.OTP = undefined; // Remove the OTP
      user.OTPExpires = undefined; // Remove the expiration time

      await user.save({ validateBeforeSave: false });
      return next(
        new IndexError("Email could not be sent. Please try again", 500)
      );
    }
  }
);
