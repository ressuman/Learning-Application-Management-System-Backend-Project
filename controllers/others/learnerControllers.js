import validator from "validator";
import mongoose from "mongoose";
import asyncHandler from "../../middlewares/asyncHandler.js";
import IndexError from "../../middlewares/indexError.js";
import Learner from "../../models/others/learnerModel.js";
import User from "../../models/users/userModel.js";

/**
 * @desc Create a new learner (Admin only)
 * @route POST /api/v1/learners/create-learner
 * @access Private (Admin)
 */
export const createLearner = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only an admin can create a new learner
  if (!admin) {
    return next(
      new IndexError("Access denied.  Only admins can create learners.", 403)
    );
  }

  const {
    firstname,
    lastname,
    email,
    gender,
    location,
    phone,
    disability,
    image,
    description,
    amount,
    courses,
  } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new IndexError("No user found with this email", 404));
  }

  // Validate email
  if (!validator.isEmail(email)) {
    throw new IndexError("Invalid email format", 400);
  }

  // Validate phone
  if (!validator.isMobilePhone(phone, "any")) {
    throw new IndexError("Invalid phone number", 400);
  }

  // Check if email or phone already exists
  const existingLearner = await Learner.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingLearner) {
    throw new IndexError(
      "Learner with this email or phone already exists",
      400
    );
  }

  // Create a new learner
  const learner = await Learner.create({
    firstname,
    lastname,
    email,
    gender,
    location,
    phone,
    disability,
    image,
    description,
    amount,
    courses,
    user: user._id,
  });

  res.status(201).json({
    success: true,
    message: "Learner created successfully",
    data: { learner },
  });
});

/**
 * @desc Get all learners (Admin only)
 * @route GET /api/v1/learners/all-learners
 * @access Private (Admin)
 */
export const getLearners = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only an admin can view all learners
  if (!admin) {
    return next(
      new IndexError("Access denied.  Only admins can view all learners.", 403)
    );
  }

  // Pagination setup
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const learners = await Learner.find()
    .populate("user courses")
    .skip(skip)
    .limit(limit);

  const totalLearners = await Learner.countDocuments();

  res.status(200).json({
    success: true,
    message: "Learners retrieved successfully",
    results: learners.length,
    totalLearners,
    currentPage: page,
    totalPages: Math.ceil(totalLearners / limit),
    data: { learners },
  });
});

/**
 * @desc Get a single learner by ID (Admin or Learner themselves)
 * @route GET /api/v1/learners/get-learner/:id
 * @access Private (Admin, Learner themselves)
 */
export const getLearner = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Extract learnerId from the request parameters
  const { learnerId } = req.params;

  // Ensure only an admin can view a learner
  if (!admin) {
    return next(
      new IndexError("Access denied.  Only admins can view a learner.", 403)
    );
  }

  // Validate learner ID format
  if (!mongoose.Types.ObjectId.isValid(learnerId)) {
    return next(new IndexError("Invalid learner ID", 400));
  }

  // Validate learner ID format
  if (!learnerId) {
    return next(new IndexError("Learner ID is required", 400));
  }

  // Find the learner by ID
  const learner = await Learner.findById(learnerId).populate("user courses");

  if (!learner) {
    return next(new IndexError("Learner not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Learner retrieved successfully",
    data: { learner },
  });
});

/**
 * @desc Update learner details (Admin or Learner themselves)
 * @route PUT /api/v1/learners/:id
 * @access Private (Admin, Learner themselves)
 */
export const updateLearner = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Extract learnerId from the request parameters
  const { learnerId } = req.params;

  const {
    firstname,
    lastname,
    email,
    gender,
    location,
    phone,
    disability,
    image,
    description,
    amount,
    courses,
  } = req.body;

  // Ensure only an admin can update a learner
  if (!admin) {
    return next(
      new IndexError("Access denied.  Only admins can update a learner.", 403)
    );
  }

  // Validate learner ID format
  if (!mongoose.Types.ObjectId.isValid(learnerId)) {
    return next(new IndexError("Invalid learner ID", 400));
  }

  // Validate learner ID
  if (!learnerId) {
    return next(new IndexError("Learner ID is required", 400));
  }

  const existingLearner = await Learner.findOne({
    $or: [{ email }, { phone }],
    _id: { $ne: learnerId }, // Ensure it's not the same user
  });

  if (existingLearner) {
    throw new IndexError("Email or phone already exists.", 400);
  }

  if (!admin && req.user._id !== learner.user) {
    return next(new IndexError("Access denied", 403));
  }

  // Find the learner by ID
  const learner = await Learner.findById(learnerId);

  if (!learner) {
    return next(new IndexError("Learner not found", 404));
  }

  // Validate email if provided
  if (email && !validator.isEmail(email)) {
    throw new IndexError("Invalid email format", 400);
  }

  // Validate phone if provided
  if (phone && !validator.isMobilePhone(phone, "any")) {
    throw new IndexError("Invalid phone number", 400);
  }

  // Update learner details
  if (firstname) {
    learner.firstname = firstname;
  }
  if (lastname) {
    learner.lastname = lastname;
  }
  if (email) {
    learner.email = email;
  }
  if (gender) {
    learner.gender = gender;
  }
  if (location) {
    learner.location = location;
  }
  if (phone) {
    learner.phone = phone;
  }
  if (disability) {
    learner.disability = disability;
  }
  if (image) {
    learner.image = image;
  }
  if (description) {
    learner.description = description;
  }
  if (amount) {
    learner.amount = amount;
  }
  if (courses) {
    learner.courses = courses;
  }

  // Save the updated learner details to the database
  const updatedLearner = await learner.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "Learner details updated successfully",
    data: { updatedLearner },
  });
});

/**
 * @desc Delete a learner (Admin only)
 * @route DELETE /api/v1/learners/:id
 * @access Private (Admin)
 */
export const deleteLearner = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can delete a learner.", 403)
    );
  }

  const { learnerId } = req.params;

  if (!learnerId) {
    return next(new IndexError("User ID is required", 400));
  }

  const learner = await Learner.findById(learnerId);

  if (!learner) {
    return next(new IndexError("Learner not found", 404));
  }

  await learner.findByIdAndUpdate(
    learnerId,
    { isDeleted: true },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Learner deleted successfully",
    data: null,
  });
});
