import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username must be at most 30 characters long"],
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validator: [validator.isEmail, "Please enter a valid email address"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "Password confirm is required"],
      minlength: [6, "Password confirm must be at least 6 characters long"],
      select: false,
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    OTP: {
      type: String,
      default: null,
      //select: false,
    },

    OTPExpires: {
      type: Date,
      default: null,
      select: false,
    },

    resetPasswordOTP: {
      type: String,
      default: null,
      //select: false,
    },

    resetPasswordOTPExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hashSync(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
