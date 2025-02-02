import asyncHandler from "../../../middlewares/asyncHandler.js";

// Create a new user profile.
export const createUserProfile = asyncHandler(async (req, res, next) => {});

// Fetches a specific user's profile by ID.
export const getUserProfileByUserId = asyncHandler(
  async (req, res, next) => {}
);

//  Retrieves a list of all users.
export const getAllUsers = asyncHandler(async (req, res, next) => {});

//  Retrieves a list of all admins.
export const getAllAdmins = asyncHandler(async (req, res, next) => {});

// Fetches both admins and users.
export const getAllAdminsAndUsers = asyncHandler(async (req, res, next) => {});

export const updateUserProfileByUserId = asyncHandler(
  async (req, res, next) => {}
);

export const deleteUserProfileByUserId = asyncHandler(
  async (req, res, next) => {}
);
