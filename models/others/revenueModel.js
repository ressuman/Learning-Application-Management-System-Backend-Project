import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    totalRevenue: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },

    invoices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
      },
    ], // Tracks invoices contributing to revenue

    revenueEntries: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const Revenue = mongoose.model("Revenue", revenueSchema);

export default Revenue;
