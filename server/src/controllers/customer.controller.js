import Customer from "../models/customer.model.js";

export const createCustomer = async (req, res) => {
  try {
    const customer = new Customer({ ...req.body, user: req.user.id });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.user.id });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
