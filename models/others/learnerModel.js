import mongoose from "mongoose";
import validator from "validator";

const learnerSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
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

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },

    disability: {
      type: String,
      default: "None",
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0,
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const Learner = mongoose.model("Learner", learnerSchema);

export default Learner;
