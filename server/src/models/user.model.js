import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    phoneNumber: String,
    address: String,
    profilePicture: {
      type: String,
      default: "", 
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
