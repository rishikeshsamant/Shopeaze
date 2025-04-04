import Item from "../models/item.model.js";

export const createItem = async (req, res) => {
  try {
    const item = new Item({ ...req.body, user: req.user.id });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
