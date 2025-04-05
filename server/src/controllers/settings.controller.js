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


export const getCompanyInfo = async (req, res) => {
  try {
    const settings = await Settings.findOne({ user: req.user.id });
    
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    
    
    const companyInfo = {
      businessName: settings.businessName,
      logo: settings.logo,
      country: settings.country,
      address: settings.address,
      language: settings.language
    };
    
    res.json(companyInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateCompanyInfo = async (req, res) => {
  try {
    const { businessName, logo, country, address, language } = req.body;
    
    const settings = await Settings.findOneAndUpdate(
      { user: req.user.id },
      { businessName, logo, country, address, language },
      { new: true, upsert: true }
    );
    
    
    const companyInfo = {
      businessName: settings.businessName,
      logo: settings.logo,
      country: settings.country,
      address: settings.address,
      language: settings.language
    };
    
    res.json(companyInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getInvoiceSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne({ user: req.user.id });
    
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    
    
    const invoiceSettings = {
      home: settings.home
    };
    
    res.json(invoiceSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateInvoiceSettings = async (req, res) => {
  try {
    const { home } = req.body;
    
    const settings = await Settings.findOneAndUpdate(
      { user: req.user.id },
      { home },
      { new: true, upsert: true }
    );
    
    
    const invoiceSettings = {
      home: settings.home
    };
    
    res.json(invoiceSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
