import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import IndexError from "./indexError.js";
import dotenv from "dotenv";
import User from "../models/users/userModel.js";
import Admin from "../models/users/adminModel.js";
dotenv.config();

export const isUserAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new IndexError(
        "Not authenticated. You  are not logged in. Please log in as a user to have access to this resource.",
        401
      )
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new IndexError(
        "The user belonging to this token does no longer exist. User not found.",
        401
      )
    );
  }

  req.user = currentUser;

  next();
});

export const isAdminAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new IndexError(
        "Not authenticated.You  are not logged in. Please log in as an admin to access this resource.",
        401
      )
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentAdmin = await Admin.findById(decoded.id);

  if (!currentAdmin) {
    return next(
      new IndexError(
        "The admin belonging to this token does not exist. Admin not found.",
        401
      )
    );
  }

  req.admin = currentAdmin; // Attach admin to request

  next();
});
