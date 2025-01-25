//import { randomInt } from "crypto";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

// export function generateOTP() {
//   return Math.floor(1000 + Math.random() * 9000).toString();
// }

// export function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// export function generateOTP() {
//   return randomInt(100000, 1000000).toString();
// }

export async function generateOTP() {
  // Generate a UUID and take the first 6 numeric characters
  // Ensure the OTP has 6 digits (padding if needed)
  const OTP = uuidv4().replace(/\D/g, "").slice(0, 6).padEnd(6, "0");

  // Hash the OTP
  const hashedOTP = await bcrypt.hash(OTP, 12);

  // Return both the OTP and its hashed version
  return { OTP, hashedOTP };
}

// import bcrypt from "bcrypt";
// import asyncHandler from "express-async-handler";
// import User from "../models/User"; // Adjust to your actual user model path

// export const verifyEmail = asyncHandler(async (req, res, next) => {
//   const { email, OTP } = req.body;

//   if (!email || !OTP) {
//     return next(new Error("Please provide both email and OTP"));
//   }

//   // Find the user by email
//   const user = await User.findOne({ email });

//   if (!user) {
//     return next(new Error("User not found"));
//   }

//   // Check if OTP has expired
//   if (user.OTPExpires < Date.now()) {
//     return next(new Error("OTP has expired. Please request a new one."));
//   }

//   // Compare the provided OTP with the hashed OTP in the database
//   const isMatch = await bcrypt.compare(OTP, user.OTP);

//   if (!isMatch) {
//     return next(new Error("Invalid OTP. Please try again."));
//   }

//   // Mark the user's email as verified (or perform any other action)
//   user.isEmailVerified = true;
//   user.OTP = undefined; // Clear the OTP
//   user.OTPExpires = undefined; // Clear the expiration time
//   await user.save();

//   res.status(200).json({
//     status: "success",
//     message: "Email verified successfully!",
//   });
// });
