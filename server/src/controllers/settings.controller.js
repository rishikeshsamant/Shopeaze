import Settings from "../models/settings.model.js";

export const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { user: req.user.id },
      { ...req.body },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne({ user: req.user.id });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
