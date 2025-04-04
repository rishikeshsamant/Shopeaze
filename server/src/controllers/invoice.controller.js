import Invoice from "../models/invoice.model.js";

export const createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice({ ...req.body, user: req.user.id });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id }).populate(
      "customer"
    );
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
