import mongoose from "mongoose";

const embeddedItemSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    name: String,
    quantity: Number,
    price: Number,
    total: Number,
  },
  { _id: false }
);

const paymentInfoSchema = new mongoose.Schema(
  {
    method: String,
    date: Date,
    notes: String,
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    billingAddress: String,
    shippingAddress: String,
    email: String,
    phone: String,
    status: {
      type: String,
      enum: ["paid", "unpaid", "partial"],
      default: "unpaid",
    },
    items: [embeddedItemSchema],
    totalAmount: Number,
    amountPaid: Number,
    paymentInfo: paymentInfoSchema,
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
