import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    amount: Number,
    method: String,
    notes: String,
  },
  { _id: false }
);

const paymentHistorySchema = new mongoose.Schema(
  {
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    amount: Number,
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
    phoneNumber: String,
    billingAddress: String,
    shippingAddress: String,
    balanceDue: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    transactions: [transactionSchema],
    paymentHistory: [paymentHistorySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
