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
