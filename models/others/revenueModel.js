import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    totalRevenue: {
      type: Number,
      default: 0,
      required: true,
      min: [0, "Total revenue must be a positive number"],
    },

    invoices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        validate: {
          validator: async function (value) {
            const invoice = await mongoose.model("Invoice").findById(value);
            return !!invoice;
          },
          message: "Invoice does not exist",
        },
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
          required: [true, "Amount is required"],
          min: [0, "Amount must be a positive number"],
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

const Revenue = mongoose.model("Revenue", revenueSchema);

export default Revenue;
