import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// export const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

// export const createSendUserToken = (user, statusCode, res, message) => {
//   const token = signToken(user._id);

//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
//   };

//   res.cookie("token", token, cookieOptions);

//   // Exclude sensitive fields before sending the response
//   user.password = undefined;
//   user.passwordConfirm = undefined;
//   user.OTP = undefined;

//   res.status(statusCode).json({
//     status: "success",
//     message,
//     token,
//     data: {
//       user,
//     },
//   });
// };

// export const createSendAdminToken = (admin, statusCode, res, message) => {
//   const token = signToken(admin._id);

//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
//   };

//   res.cookie("token", token, cookieOptions);

//   // Exclude sensitive fields before sending the response
//   admin.password = undefined;
//   admin.passwordConfirm = undefined;
//   admin.OTP = undefined;

//   res.status(statusCode).json({
//     status: "success",
//     message,
//     token,
//     data: {
//       admin,
//     },
//   });
// };

// /**
//  * Generate JWT token with user/admin ID
//  */
// export const signToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

// /**
//  * Send token response with cookie for both user and admin
//  */
// export const createSendToken = (userOrAdmin, statusCode, res, message) => {
//   // Determine the role dynamically based on model type
//   const role = userOrAdmin.role || (userOrAdmin.isAdmin ? "admin" : "user");
//   const token = signToken(userOrAdmin._id, role); // Add role to token

//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true, // Prevent XSS attacks
//     secure: process.env.NODE_ENV === "production", // Use HTTPS in production
//     sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Prevent CSRF
//   };

//   res.cookie("token", token, cookieOptions);

//   // Remove sensitive fields before sending the response
//   userOrAdmin.password = undefined;
//   userOrAdmin.passwordConfirm = undefined;
//   userOrAdmin.OTP = undefined;

//   // Check the role dynamically and send the respective data
//   const responseData =
//     role === "admin" ? { admin: userOrAdmin } : { user: userOrAdmin };

//   res.status(statusCode).json({
//     status: "success",
//     message,
//     token,
//     data: responseData, // Send user or admin data accordingly
//   });
// };

/**
 * Generate JWT token with user/admin ID
 */
export const signToken = (id, modelType) => {
  return jwt.sign({ id, role: modelType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Send token response with cookie for both user and admin
 */
export const createSendToken = (userOrAdmin, statusCode, res, message) => {
  // Determine model type dynamically
  const modelType =
    userOrAdmin.constructor.modelName === "Admin" ? "admin" : "user";
  const token = signToken(userOrAdmin._id, modelType);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Prevent CSRF
  };

  res.cookie("token", token, cookieOptions);

  // Remove sensitive fields before sending the response
  userOrAdmin.password = undefined;
  userOrAdmin.passwordConfirm = undefined;
  userOrAdmin.OTP = undefined;

  // Dynamically structure response data
  const responseData =
    modelType === "admin" ? { admin: userOrAdmin } : { user: userOrAdmin };

  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: responseData,
  });
};
