import asyncHandler from "../../../middlewares/asyncHandler.js";
import IndexError from "../../../middlewares/indexError.js";
import Admin from "../../../models/users/adminModel.js";

export const getAdminProfile = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  if (!admin) {
    return next(new IndexError("Admin not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Admin profile retrieved successfully",
    data: {
      admin,
    },
  });
});

export const updateAdminProfile = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, password, passwordConfirm, contact } =
    req.body;

  const { admin } = req;

  if (!admin) {
    return next(new IndexError("Admin not found", 404));
  }

  // Ensure email is unique
  if (email && email !== admin.email) {
    const emailExists = await Admin.findOne({ email });
    if (emailExists) {
      return next(new IndexError("Email is already in use", 400));
    }
  }

  // Update admin fields
  if (first_name) admin.first_name = first_name;
  if (last_name) admin.last_name = last_name;
  if (email) admin.email = email;
  if (password) {
    if (!passwordConfirm) {
      return next(new IndexError("Password confirmation is required", 400));
    }
    if (password !== passwordConfirm) {
      return next(new IndexError("Passwords do not match", 400));
    }
    admin.password = password;
  }
  if (contact) admin.contact = contact;

  // Save the updated admin with validation
  await admin.save({ validateBeforeSave: true });

  // Exclude sensitive fields
  admin.password = undefined;

  res.status(200).json({
    status: "success",
    message: "Admin profile updated successfully",
    data: {
      admin,
    },
  });
});

export const deleteAdminProfile = asyncHandler(async (req, res, next) => {
  const admin = req.admin;

  if (!admin) {
    return next(new IndexError("Admin not found", 404));
  }

  await Admin.findByIdAndUpdate(admin._id, { isDeleted: true }, { new: true });

  res.status(200).json({
    status: "success",
    message: "Admin profile deleted successfully",
    data: null,
  });
});
