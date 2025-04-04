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

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
