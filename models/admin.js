import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

// Create indexes for better query performance
if (Admin.collection) {
  Admin.collection.createIndex({ email: 1 }, { unique: true });
}

export default Admin;

