import mongoose from "mongoose";
import asyncHandler from "../../middlewares/asyncHandler.js";
import IndexError from "../../middlewares/indexError.js";
import Course from "../../models/others/courseModel.js";
import Learner from "../../models/others/learnerModel.js";

// Helper functions
const validateCourseDiscount = (discount) => {
  if (discount < 0 || discount > 100) {
    throw new IndexError("Course discount must be between 0-100%", 400);
  }
};

const formatCourseResponse = (course) => ({
  ...course.toObject(),
  pricing: {
    basePrice: course.basePrice,
    discount: course.discount,
    discountedPrice: course.discountedPrice,
  },
});

/**
 * @desc Create a new course (Admin only)
 * @route POST /api/v1/courses/create-course
 * @access Private (Admin)
 */
export const createCourse = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only an admin can create a course
  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can create courses.", 403)
    );
  }

  const { title, description, duration, basePrice, discount, learners } =
    req.body;

  // Validate required fields
  if (!title || !description || !duration || basePrice === undefined) {
    return next(new IndexError("All fields are required", 400));
  }

  // Validate discount
  validateCourseDiscount(discount);

  // Validate learners if provided
  if (learners && learners.length > 0) {
    const existingLearners = await Learner.find({
      _id: { $in: learners },
      user: { $exists: true },
    });
    if (existingLearners.length !== learners.length) {
      return next(new IndexError("One or more learners do not exist", 400));
    }
  }

  // Validate  basePrice matches learner amount if needed
  if (learners && learners.length > 0) {
    const learnersData = await Learner.find({ _id: { $in: learners } });
    const invalid = learnersData.some((l) => l.amount !== basePrice);
    if (invalid) {
      return next(
        new IndexError("Learner amount doesn't match course  basePrice", 400)
      );
    }
  }

  // Create a new course
  const course = new Course({
    title,
    description,
    duration,
    basePrice,
    discount: discount || 0,
    learners: learners || [],
  });

  await course.save();

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: { course: formatCourseResponse(course) },
  });
});

/**
 * @desc    Get all courses (Admin only)
 * @route   GET /api/v1/courses/all-courses
 * @access  Private (Admin)
 */
export const getCourses = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only admin can view all courses
  if (!admin) {
    return next(
      new IndexError(
        "Access denied. Only authenticated admins can view all courses.",
        403
      )
    );
  }

  // Pagination setup
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const courses = await Course.find()
    .populate({
      path: "learners",
      select: "firstname lastname email",
    }) // Populate learners with user data
    .skip(skip)
    .limit(limit);

  const totalCourses = await Course.countDocuments();

  res.status(200).json({
    success: true,
    message: "Courses retrieved successfully",
    results: courses.length,
    totalCourses,
    currentPage: page,
    totalPages: Math.ceil(totalCourses / limit),
    data: { courses: courses.map(formatCourseResponse) },
  });
});

/**
 * @desc    Get a single course by ID (Admin only)
 * @route   GET /api/v1/courses/get-course/:courseId
 * @access  Private (Admin)
 */
export const getCourse = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only admin can view a course
  if (!admin) {
    return next(
      new IndexError(
        "Access denied. Only authenticated admins can view a course.",
        403
      )
    );
  }

  const { courseId } = req.params;

  // Validate course ID
  if (!courseId) {
    return next(new IndexError("Course ID is required", 400));
  }

  const course = await Course.findById(courseId).populate({
    path: "learners",
    select: "firstname lastname email balance",
  });

  if (!course) {
    return next(new IndexError("Course not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Course retrieved successfully",
    data: { course: formatCourseResponse(course) },
  });
});

/**
 * @desc    Update course details (Admin only)
 * @route   PUT /api/v1/courses/update-course/:courseId
 * @access  Private (Admin)
 */
export const updateCourse = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only an admin can update a course
  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can update courses.", 403)
    );
  }

  const { courseId } = req.params;

  const { title, description, duration, price, learners } = req.body;

  // Validate course ID
  if (!courseId) {
    return next(new IndexError("Course ID is required", 400));
  }

  const course = await Course.findById(courseId);
  course._originalLearners = course.learners; // Capture initial state

  if (learners) {
    course.learners = learners; // Let middleware handle updates
  }

  if (!course) {
    return next(new IndexError("Course not found", 404));
  }

  // Validate learners if provided
  if (learners && learners.length > 0) {
    const existingLearners = await Learner.find({ _id: { $in: learners } });
    if (existingLearners.length !== learners.length) {
      return next(new IndexError("One or more learners do not exist", 400));
    }
  }

  // Update course details
  if (title) {
    course.title = title;
  }
  if (description) {
    course.description = description;
  }
  if (duration) {
    course.duration = duration;
  }
  if (price) {
    course.price = price;
  }

  const updatedCourse = await course.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    data: { updatedCourse },
  });
});

/**
 * @desc    Delete a course (Admin only)
 * @route   DELETE /api/v1/courses/delete-course/:courseId
 * @access  Private (Admin)
 */
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const { admin } = req;

  // Ensure only an admin can delete a course
  if (!admin) {
    return next(
      new IndexError("Access denied. Only admins can delete courses.", 403)
    );
  }

  const { courseId } = req.params;

  // Validate course ID
  if (!courseId) {
    return next(new IndexError("Course ID is required", 400));
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new IndexError("Course not found", 404));
  }

  await Course.findByIdAndUpdate(courseId, { isDeleted: true }, { new: true });

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
    data: null,
  });
});
