import mongoose, { Schema } from "mongoose";

const paymentRequestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    transactionId: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true, // Format: "2025-01"
    },
    amount: {
      type: Number,
      required: true,
    },
    screenshotURL: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentRequest = mongoose.models.PaymentRequest || mongoose.model("PaymentRequest", paymentRequestSchema);

// Create indexes for better query performance
if (PaymentRequest.collection) {
  PaymentRequest.collection.createIndex({ verified: 1, createdAt: -1 });
  PaymentRequest.collection.createIndex({ customerId: 1 });
}

export default PaymentRequest;

