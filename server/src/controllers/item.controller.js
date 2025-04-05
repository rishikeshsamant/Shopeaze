import Item from "../models/item.model.js";
import Category from "../models/category.model.js";

export const createItem = async (req, res) => {
  try {
    const categoryExists = await Category.findOne({ 
      _id: req.body.category,
      user: req.user.id
    });
    
    if (!categoryExists) {
      return res.status(400).json({ 
        message: "Selected category does not exist. Please create the category first."
      });
    }
    
    const item = new Item({ ...req.body, user: req.user.id });
    await item.save();
    
    
    const populatedItem = await Item.findById(item._id).populate('category');
    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id })
      .populate('category')
      .sort({ createdAt: -1 });
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
    }).populate('category');
    
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
    
    if (req.body.category) {
      const categoryExists = await Category.findOne({ 
        _id: req.body.category,
        user: req.user.id
      });
      
      if (!categoryExists) {
        return res.status(400).json({ 
          message: "Selected category does not exist. Please create the category first."
        });
      }
    }
    
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('category');
    
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
