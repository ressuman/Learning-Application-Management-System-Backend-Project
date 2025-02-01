import sendEmail from "../../../helpers/email.js";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import IndexError from "../../../middlewares/indexError.js";
import Admin from "../../../models/users/adminModel.js";
import { createSendToken } from "../../../utils/createToken.js";
import { generateOTP } from "../../../utils/generateOTP.js";

export const adminSignUp = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, password, passwordConfirm, contact } =
    req.body;

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    return next(new IndexError("Email already exists", 400));
  }

  const { OTP, hashedOTP } = await generateOTP();

  const OTPExpires = new Date(Date.now() + 15 * 60 * 1000);

  const newAdmin = new Admin({
    first_name,
    last_name,
    email,
    contact,
    password,
    passwordConfirm,
    OTP: hashedOTP,
    OTPExpires,
  });

  await newAdmin.save();

  const emailTemplate = `
   <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
    <div style="text-align: center; padding: 10px 0;">
      <img src="http://localhost:4039/public/gclient-logo" alt="G Client Logo" style="max-width: 150px; margin-bottom: 20px;" />
    </div>
    <h2 style="color: #0056b3; text-align: center;">Verify Your Email Address</h2>
    <p style="font-size: 16px;">Dear <strong>${first_name} ${last_name}</strong>,</p>
    <p style="font-size: 16px;">Welcome to <strong>${
      process.env.APP_NAME || "G_Client"
    }</strong>! We're excited to have you on board. To complete your registration, please verify your email address by entering the OTP below:</p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="font-size: 28px; font-weight: bold; color: #0056b3; border: 1px dashed #ddd; padding: 10px 20px; display: inline-block; background-color: #fff;">
        ${OTP}
      </span>
    </div>
    <p style="font-size: 16px; text-align: center;">This OTP is valid for <strong>15 minutes</strong>. Please do not share this OTP with anyone.</p>
    <p style="font-size: 16px;">If you did not sign up for an account with us, you can safely ignore this email. If you encounter any issues, feel free to reach out to our support team.</p>
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
    await sendEmail({
      email: newAdmin.email,
      subject: "Your OTP for Email Verification (Valid for 15 Minutes)",
      html: emailTemplate,
      message: `Dear ${first_name} ${last_name},\n\nYour OTP for email verification is: ${OTP}. This OTP is valid for 15 minutes. If you did not request this, please ignore this email.\n\nBest regards,\nThe ${
        process.env.APP_NAME || "G_Client"
      } Team.`,
    });

    createSendToken(
      newAdmin,
      201,
      res,
      "Admin created successfully. Please check your email for the OTP."
    );
  } catch (error) {
    //await Admin.findByIdAndDelete(newAdmin._id);
    await Admin.deleteOne({ _id: newAdmin._id });

    return next(
      new IndexError("Email could not be sent. Please try again", 500)
    );
  }
});

export const adminLogin = asyncHandler(async (req, res, next) => {});

export const adminLogout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "Admin-logged-out", {
    expires: new Date(Date.now() + 10 * 1000), //expires in 10 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    message: "Admin logged out successfully",
  });
});
