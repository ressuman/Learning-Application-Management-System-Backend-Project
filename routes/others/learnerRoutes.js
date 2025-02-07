import express from "express";

import {
  isAdminAuthenticated,
  isUserAuthenticated,
} from "../../middlewares/isAuthenticated.js";

import { authorizeRole } from "../../middlewares/authorizeRole.js";

import {
  createLearner,
  getLearners,
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
  //isUserAuthenticated,
  authorizeRole("admin"),
  //authorizeRole("user"),
  getLearners
);

router.put(
  "/update-learner/:learnerId",
  isAdminAuthenticated,
  //isUserAuthenticated,
  authorizeRole("admin"),
  //authorizeRole("user"),
  getLearners
);

router.delete(
  "/delete-learner/:learnerId",
  isAdminAuthenticated,
  authorizeRole("admin"),
  getLearners
);

export default router;
