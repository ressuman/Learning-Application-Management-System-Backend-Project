import express from "express";

import { isAdminAuthenticated } from "../../middlewares/isAuthenticated.js";

import { authorizeRole } from "../../middlewares/authorizeRole.js";

import {
  createLearner,
  deleteLearner,
  getLearner,
  getLearners,
  updateLearner,
} from "../../controllers/others/learnerControllers.js";

const router = express.Router();

router.post(
  "/create-learner",
  isAdminAuthenticated,
  authorizeRole("admin"),
  createLearner
);

router.get(
  "/all-learners",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getLearners
);

router.get(
  "/get-learner/:learnerId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getLearner
);

router.put(
  "/update-learner/:learnerId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  updateLearner
);

router.delete(
  "/delete-learner/:learnerId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  deleteLearner
);

export default router;
