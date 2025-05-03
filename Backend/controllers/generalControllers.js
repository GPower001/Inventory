import Item from "../models/Item.js";


export const getGenerals = async (req, res) => {
  try {
    const items = await Item.find({category: req.params.category});
    if (!items || items.length === 0) {
      return res.status(404).json({ message: "No items found" });
    }
    res.status(200).json({success: true, data:items});
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};