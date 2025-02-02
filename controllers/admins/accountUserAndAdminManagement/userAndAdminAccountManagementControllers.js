import sendEmail from "../../../helpers/email.js";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import IndexError from "../../../middlewares/indexError.js";
import Admin from "../../../models/users/adminModel.js";
import User from "../../../models/users/userModel.js";
import { generateOTP } from "../../../utils/generateOTP.js";

// Create a new user profile.  (Admin only)
export const createUserProfile = asyncHandler(async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;

  const admin = req.admin;

  // Ensure only an admin can create a new user
  if (!admin) {
    return next(
      new IndexError("Access denied.  Only admins can create users.", 403)
    );
  }

  // Check if all required fields are provided
  if (!username || !email || !password || !passwordConfirm) {
    return next(new IndexError("All fields are required", 400));
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new IndexError("Email is already in use", 400));
  }

  // Ensure passwords match
  if (password !== passwordConfirm) {
    return next(new IndexError("Passwords do not match", 400));
  }

  //  Generate OTP and hashed OTP
  const { OTP, hashedOTP } = await generateOTP();

  const OTPExpires = new Date(Date.now() + 15 * 60 * 1000);

  // Create new user
  const newUser = new User({
    username,
    email,
    password,
    passwordConfirm,
    OTP: hashedOTP,
    OTPExpires,
  });

  // Save the new user
  await newUser.save();

  const emailTemplate = `
   <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
    <div style="text-align: center; padding: 10px 0;">
      <img src="http://localhost:4039/public/gclient-logo" alt="G Client Logo" style="max-width: 150px; margin-bottom: 20px;" />
    </div>
    <h2 style="color: #0056b3; text-align: center;">Your Account Has Been Created</h2>
    <p style="font-size: 16px;">Dear <strong>${username}</strong>,</p>
    <p style="font-size: 16px;">An administrator has created a profile for you on <strong>${
      process.env.APP_NAME || "G_Client"
    }</strong>. To activate your account and set up your credentials, please verify your email address using the OTP below:</p>

    <div style="text-align: center; margin: 20px 0;">
      <span style="font-size: 28px; font-weight: bold; color: #0056b3; border: 1px dashed #ddd; padding: 10px 20px; display: inline-block; background-color: #fff;">
        ${OTP}
      </span>
    </div>

    <p style="font-size: 16px; text-align: center;">This OTP is valid for <strong>15 minutes</strong>. Please do not share this OTP with anyone.</p>

    <p style="font-size: 16px;">Once verified, you will be able to log in and update your account details.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="mailto:support@example.com" style="text-decoration: none; color: #fff; background-color: #0056b3; padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: bold;">Contact Support</a>
    </div>

    <p style="font-size: 14px; text-align: center; color: #888;">If you did not expect this email, please ignore it or contact our support team.</p>
    <p style="font-size: 14px; text-align: center; color: #888;">Thank you for joining <strong>${
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
      subject: "Your Account Has Been Created – Verify Your Email",
      html: emailTemplate,
      message: `Dear ${username},\n\nAn administrator has created an account for you on ${
        process.env.APP_NAME || "G_Client"
      }. To activate your account, please verify your email using the OTP below:\n\nOTP: ${OTP}\n\nThis OTP is valid for 15 minutes.\n\nIf you did not expect this email, please ignore it or contact support.\n\nBest regards,\nThe ${
        process.env.APP_NAME || "G_Client"
      } Team.`,
    });

    res.status(201).json({
      status: "success",
      message:
        "User profile created successfully. Please check your email for the OTP for verification.",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    await User.findByIdAndDelete(newUser._id);

    return next(new IndexError("Email could not be sent", 500));
  }
});

// Fetches a specific user's profile by ID.(Admin only)
export const getUserProfileByUserId = asyncHandler(async (req, res, next) => {
  const admin = req.admin;

  // Ensure only an admin can access this route
  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can fetch user profiles.", 403)
    );
  }

  // Extract userId from the request parameters
  const { userId } = req.params;

  // Validate user ID format
  if (!userId) {
    return next(new IndexError("User ID is required", 400));
  }

  // Find user by ID
  const user = await User.findById(userId).select("-password");

  if (!user) {
    return next(new IndexError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User profile retrieved successfully",
    data: { user },
  });
});

//  Retrieves a list of all users.(Admin only)
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const admin = req.admin;

  // Ensure only an admin can access this route
  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can view all users.", 403)
    );
  }

  // Pagination setup
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Fetch all users except passwords
  const users = await User.find().select("-password").skip(skip).limit(limit);
  const totalUsers = await User.countDocuments();

  res.status(200).json({
    status: "success",
    message: "All users retrieved successfully",
    results: users.length,
    totalUsers,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
    data: { users },
  });
});

//  Retrieves a list of all admins.(Admin only)
export const getAllAdmins = asyncHandler(async (req, res, next) => {
  const admin = req.admin;

  // Ensure only an admin can access this route
  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can view all admins.", 403)
    );
  }

  // Pagination setup
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Retrieve all admins except passwords
  const admins = await Admin.find().select("-password").skip(skip).limit(limit);
  const totalAdmins = await Admin.countDocuments();

  res.status(200).json({
    status: "success",
    message: "All admins retrieved successfully",
    results: admins.length,
    totalAdmins,
    currentPage: page,
    totalPages: Math.ceil(totalAdmins / limit),
    data: { admins },
  });
});

// Fetches both admins and users.
export const getAllAdminsAndUsers = asyncHandler(async (req, res, next) => {
  const admin = req.admin;

  // Ensure only an admin can access this route
  if (!admin) {
    return next(
      new IndexError(
        "Access denied. Only admins can view all users and admins.",
        403
      )
    );
  }

  // Pagination setup
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get admins and users
  const admins = await Admin.find().select("-password").skip(skip).limit(limit);
  const totalAdmins = await Admin.countDocuments();

  const users = await User.find().select("-password").skip(skip).limit(limit);
  const totalUsers = await User.countDocuments();

  res.status(200).json({
    status: "success",
    message: "All users and admins retrieved successfully",
    results: { admins: admins.length, users: users.length },
    totalAdmins,
    totalUsers,
    currentPage: page,
    totalPages: Math.ceil(totalAdmins / limit),
    data: { admins, users },
  });
});

export const updateUserProfileByUserId = asyncHandler(
  async (req, res, next) => {
    const admin = req.admin;
    const { userId } = req.params;
    const { username, email, password, passwordConfirm } = req.body;

    // Ensure only an admin can update a user profile
    if (!admin) {
      return next(
        new IndexError(
          "Access denied. Only admins can update user profiles.",
          403
        )
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(new IndexError("User not found", 404));
    }

    // Ensure email is unique
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return next(new IndexError("Email is already in use", 400));
      }
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      if (!passwordConfirm) {
        return next(new IndexError("Password confirmation is required", 400));
      }
      if (password !== passwordConfirm) {
        return next(new IndexError("Passwords do not match", 400));
      }
      user.password = password;
    }

    await user.save({ validateBeforeSave: true });

    // Exclude sensitive fields
    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "User profile updated successfully",
      data: { user },
    });
  }
);

export const deleteUserProfileByUserId = asyncHandler(
  async (req, res, next) => {
    const admin = req.admin;
    const { userId } = req.params;

    // Ensure only an admin can delete a user profile
    if (!admin) {
      return next(
        new IndexError(
          "Access denied. Only admins can delete user profiles.",
          403
        )
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(new IndexError("User not found", 404));
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      status: "success",
      message: "User profile deleted successfully",
      data: null,
    });
  }
);
