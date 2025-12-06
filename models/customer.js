import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    village: {
      type: String,
      required: true,
    },
    billAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

// Create indexes for better query performance
if (Customer.collection) {
  Customer.collection.createIndex({ village: 1 });
  Customer.collection.createIndex({ name: 1 });
  Customer.collection.createIndex({ phone: 1 });
}

export default Customer;

