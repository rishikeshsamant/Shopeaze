import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    home: String,
    logo: String,
    language: String,
    country: String,
    address: String,
    businessName: String,
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
