import sendEmail from "../../../helpers/email.js";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import IndexError from "../../../middlewares/indexError.js";
import User from "../../../models/users/userModel.js";
import { createSendToken } from "../../../utils/createToken.js";
import { generateOTP } from "../../../utils/generateOTP.js";

export const userSignUp = asyncHandler(async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new IndexError("Email already exists", 400));
  }

  const { OTP, hashedOTP } = await generateOTP();

  const OTPExpires = Date.now() + 15 * 60 * 1000; // Expiry is 15 minutes from now

  const newUser = new User({
    username,
    email,
    password,
    passwordConfirm,
    OTP: hashedOTP,
    OTPExpires,
  });

  await newUser.save();

  const emailTemplate = `
   <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
    <div style="text-align: center; padding: 10px 0;">
      <img src="http://localhost:4039/public/gclient-logo" alt="G Client Logo" style="max-width: 150px; margin-bottom: 20px;" />
    </div>
    <h2 style="color: #0056b3; text-align: center;">Verify Your Email Address</h2>
    <p style="font-size: 16px;">Dear <strong>${username}</strong>,</p>
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
      email: newUser.email,
      subject: "Your OTP for Email Verification (Valid for 15 Minutes)",
      html: emailTemplate,
      message: `Dear ${username},\n\nYour OTP for email verification is: ${OTP}. This OTP is valid for 15 minutes. If you did not request this, please ignore this email.\n\nBest regards,\nThe ${
        process.env.APP_NAME || "G_Client"
      } Team.`,
    });

    // createSendToken(
    //   newUser,
    //   201,
    //   res,
    //   "User created successfully. Please check your email for the OTP for verification."
    // );
    res.status(201).json({
      status: "success",
      message:
        "User registered successfully. Please check your email for the OTP for email verification to activate your account.",
    });
  } catch (error) {
    //await User.findByIdAndDelete(newUser._id);
    await User.deleteOne({ _id: newUser._id });

    return next(
      new IndexError("Email could not be sent. Please try again", 500)
    );
  }
});

export const userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new IndexError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new IndexError("Invalid email or password", 401));
  }

  if (!user.isVerified) {
    return next(
      new IndexError(
        "Your account is not verified. Please verify your email",
        401
      )
    );
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new IndexError("Invalid email or password", 401));
  }

  createSendToken(user, 200, res, "User logged in successfully");
});

export const checkUserAuth = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new IndexError("User not authenticated", 401);
  }

  res.status(200).json({
    success: true,
    message: "User authenticated",
    data: {
      id: req.user._id,
      email: req.user.email,
      isVerified: req.user.isVerified,
    },
  });

  next();
});

export const userLogout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "User-logged-out", {
    expires: new Date(Date.now() + 5 * 1000), //expires in 5 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    //sameSite: "none",
  });

  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
});
