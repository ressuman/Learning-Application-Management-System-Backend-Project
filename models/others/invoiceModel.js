import mongoose from "mongoose";
import Revenue from "./revenueModel.js";

const invoiceSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Learner", // Reference to the Learner model
      required: [true, "Learner ID is required"],
      validate: {
        validator: async function (value) {
          const learner = await mongoose.model("Learner").findById(value);
          return !!learner;
        },
        message: "Learner does not exist",
      },
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course ID is required"],
      validate: {
        validator: async function (value) {
          const course = await mongoose.model("Course").findById(value);
          return !!course;
        },
        message: "Course does not exist",
      },
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue", "Voided"],
      default: "Pending",
    },

    installmentPlan: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },

    installments: [
      {
        dueDate: Date,
        amount: Number,
        status: {
          type: String,
          enum: ["Pending", "Paid", "Overdue"],
          default: "Pending",
        },
      },
    ],

    totalAmount: Number,

    discountApplied: Number,

    remainingBalance: Number,

    paymentDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return this.status !== "Paid" || v;
        },
        message: "Payment date required for paid invoices",
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

invoiceSchema.pre("remove", async function (next) {
  // Remove invoice from Revenue (if using separate revenue model)
  await mongoose
    .model("Revenue")
    .updateMany({ invoices: this._id }, { $pull: { invoices: this._id } });
  next();
});

invoiceSchema.post("save", async function (doc) {
  if (doc.status === "Paid") {
    await Revenue.updateOne(
      {},
      {
        $inc: { totalRevenue: doc.amount },
        $push: {
          invoices: doc._id,
          revenueEntries: {
            amount: doc.amount,
            date: doc.paymentDate || new Date(),
          },
        },
      },
      { upsert: true }
    );
  }
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
