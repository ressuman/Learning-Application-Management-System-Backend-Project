import express from "express";

import { isAdminAuthenticated } from "../../middlewares/isAuthenticated.js";

import { authorizeRole } from "../../middlewares/authorizeRole.js";

import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from "../../controllers/others/courseControllers.js";

const router = express.Router();

// Create a new course (Admin only)
router.post(
  "/create-course",
  isAdminAuthenticated,
  authorizeRole("admin"),
  createCourse
);

// Get all courses (Admin only)
router.get(
  "/all-courses",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getCourses
);

// Get a single course by ID (Admin only)
router.get(
  "/get-course/:courseId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getCourse
);

// Update course details (Admin only)
router.put(
  "/update-course/:courseId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  updateCourse
);

// Delete a course (Admin only)
router.delete(
  "/delete-course/:courseId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  deleteCourse
);

export default router;
