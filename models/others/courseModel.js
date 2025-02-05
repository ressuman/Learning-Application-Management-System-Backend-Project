import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    learners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Learner",
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
