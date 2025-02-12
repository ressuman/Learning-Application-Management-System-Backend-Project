import asyncHandler from "../../../middlewares/asyncHandler.js";
import IndexError from "../../../middlewares/indexError.js";
import User from "../../../models/users/userModel.js";

// Get the current logged-in user profile
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new IndexError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User profile retrieved successfully",
    data: {
      user,
    },
  });
});

// Update the current logged-in user profile  (name, email, phone, address)
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;

  const user = req.user;

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

  // Save the updated user with validation
  await user.save({ validateBeforeSave: true });

  // Exclude sensitive fields
  user.password = undefined;

  res.status(200).json({
    status: "success",
    message: "User profile updated successfully",
    data: {
      user,
    },
  });
});

// Delete the current logged-in user profile
export const deleteUserProfile = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new IndexError("User not found", 404));
  }

  await User.findByIdAndUpdate(user._id, { isDeleted: true }, { new: true });

  res.status(200).json({
    status: "success",
    message: "User profile deleted successfully",
    data: null,
  });
});
