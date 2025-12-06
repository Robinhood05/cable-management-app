import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    month: {
      type: String,
      required: true, // Format: "2025-01"
    },
    status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    paidAt: {
      type: Date,
    },
    transactionId: {
      type: String,
      default: "",
    },
    verifiedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

// Create indexes for better query performance
if (Payment.collection) {
  Payment.collection.createIndex({ customerId: 1, month: 1 }, { unique: true });
  Payment.collection.createIndex({ status: 1 });
  Payment.collection.createIndex({ month: 1 });
}

export default Payment;

