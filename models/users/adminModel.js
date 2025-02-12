import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const adminSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "Username must be at least 2 characters long"],
      maxlength: [30, "Username must be at most 30 characters long"],
      index: true,
    },

    last_name: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Username must be at least 2 characters long"],
      maxlength: [30, "Username must be at most 30 characters long"],
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
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

    contact: {
      type: String,
      required: [true, "Contact is required"],
      trim: true,
      minlength: [6, "Contact must be attempting 6 characters long"],
      maxlength: [15, "Contact must be at most 15 characters long"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    OTP: {
      type: String,
      default: null,
    },

    OTPExpires: {
      type: Date,
      default: null,
    },

    resetPasswordOTP: {
      type: String,
      default: null,
    },

    resetPasswordOTPExpires: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = bcrypt.hashSync(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

adminSchema.methods.correctPassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
