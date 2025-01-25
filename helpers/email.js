import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL_USER,
      pass: process.env.NODEMAILER_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `${process.env.NODEMAILER_EMAIL_NAME} <${process.env.NODEMAILER_EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;

// <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//   <h2 style="color: #0056b3;">Email Verification Required</h2>
//   <p>Dear ${username},</p>
//   <p>
//     Thank you for signing up. To verify your email address, please use the
//     following One-Time Password (OTP):
//   </p>
//   <p style="font-size: 24px; font-weight: bold; color: #0056b3;">${OTP}</p>
//   <p>
//     This OTP is valid for <strong>15 minutes</strong>. If you did not request
//     this, please ignore this email.
//   </p>
//   <p>For any questions or support, feel free to contact us.</p>
//   <p>Best regards,</p>
//   <p style="font-weight: bold;">
//     The ${process.env.APP_NAME || "G_Client"} Team
//   </p>
// </div>;
