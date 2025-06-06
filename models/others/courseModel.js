import mongoose from "mongoose";
import Learner from "./learnerModel.js";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    duration: {
      type: String,
      required: [true, "Duration is required"],
    },

    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price must be positive"],
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    learners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Learner",
        validate: {
          validator: async function (value) {
            const learner = await mongoose.model("Learner").findById(value);
            return !!learner;
          },
          message: "Learner does not exist",
        },
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

courseSchema.virtual("discountedPrice").get(function () {
  return this.basePrice * (1 - this.discount / 100);
});

courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

courseSchema.pre("remove", async function (next) {
  // Remove course from learners' courses array
  await mongoose
    .model("Learner")
    .updateMany({ courses: this._id }, { $pull: { courses: this._id } });
  next();
});

courseSchema.pre("save", async function (next) {
  if (this.isModified("learners")) {
    const prevLearners = this._originalLearners || [];
    const currentLearners = this.learners;

    // Remove from old learners
    await Learner.updateMany(
      { _id: { $in: prevLearners } },
      { $pull: { courses: this._id } }
    );

    // Add to new learners
    await Learner.updateMany(
      { _id: { $in: currentLearners } },
      { $addToSet: { courses: this._id } }
    );

    // Store current state for next updates
    this._originalLearners = currentLearners;
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
