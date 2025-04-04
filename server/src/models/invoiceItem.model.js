import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    name: String,
    quantity: Number,
    price: Number,
    total: Number,
  },
  { timestamps: true }
);

export default mongoose.model("InvoiceItem", invoiceItemSchema);
