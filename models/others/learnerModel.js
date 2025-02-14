import mongoose from "mongoose";
import validator from "validator";
import Course from "./courseModel.js";

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
      min: [0, "Amount must be a positive number"],
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        validate: {
          validator: async function (value) {
            const course = await mongoose.model("Course").findById(value);
            return !!course;
          },
          message: "Course does not exist",
        },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return !!user;
        },
        message: "User does not exist",
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

learnerSchema.pre("remove", async function (next) {
  // Remove from courses
  await mongoose
    .model("Course")
    .updateMany({ learners: this._id }, { $pull: { learners: this._id } });

  // Delete related invoices
  await mongoose.model("Invoice").deleteMany({ learnerId: this._id });
  next();
});

learnerSchema.pre("save", async function (next) {
  if (this.isModified("courses")) {
    const prevCourses = this._originalCourses || [];
    const currentCourses = this.courses;

    // Remove from old courses
    await Course.updateMany(
      { _id: { $in: prevCourses } },
      { $pull: { learners: this._id } }
    );

    // Add to new courses
    await Course.updateMany(
      { _id: { $in: currentCourses } },
      { $addToSet: { learners: this._id } }
    );

    this._originalCourses = currentCourses;
  }
  next();
});

const Learner = mongoose.model("Learner", learnerSchema);

export default Learner;
