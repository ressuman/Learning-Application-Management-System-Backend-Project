import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import IndexError from "./indexError";
import dotenv from "dotenv";
import User from "../models/users/userModel.js";
dotenv.config();

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new IndexError(
        "Not authenticated. You  are not logged in.Please log in to have access to this resource.",
        401
      )
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new IndexError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;

  next();
});
