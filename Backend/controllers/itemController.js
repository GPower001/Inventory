import multer from 'multer';
import Item from "../models/item.js";
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';


// File upload configuration
const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/items';
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false);
    }
  }
});

/**
 * @desc Get all items
 * @route GET /api/items
 * @access Public
 */
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).json({success: true, data:items});
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Add new item
 * @route POST /api/items
 * @access Public
 */
// export const addItem = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body); // Log the incoming request body

//     const items = req.body;

//     if (!items.name || !items.category || !items.openingQty || !items.minStock) {
//       return res.status(400).json({ message: "Name and quantity are required" });
//     }

//     const newItem = new Item(items);
//     console.log("New Item to Save:", newItem); // Log the item before saving

//     const savedItem = await newItem.save();
//     res.status(201).json({ success: true, data: savedItem });
//   } catch (error) {
//     console.error("Error in Creating item:", error); // Log the full error
//     if (error.code === 11000) {
//       return res.status(400).json({ message: "Item code already exists" });
//     }
//     res.status(500).json({ message: "Server error", error });
//   }
// };

export const addItem = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the incoming request body

    const items = req.body;

    if (!items.name || !items.category || !items.openingQty || !items.minStock) {
      return res.status(400).json({ message: "Name and quantity are required" });
    }

    // Handle expiration date if provided
    let expiryDate = undefined;
    if (items.expiryDate) {
      expiryDate = new Date(items.expiryDate);
      if (isNaN(expiryDate.getTime())) {
        return res.status(400).json({ message: "Invalid expiry date format" });
      }
    }

    const newItem = new Item({
      ...items,
      expiryDate: expiryDate, // Will be undefined if not provided
    });
    console.log("New Item to Save:", newItem); // Log the item before saving

    const savedItem = await newItem.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    console.error("Error in Creating item:", error); // Log the full error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Item code already exists" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteItems = async (req, res) => {
  try {
    const { id } = req.params;
   
    const deletedItem = await Item.findByIdAndDelete(id); // Delete item by ID
    console.log("Deleted Item:", deletedItem); // Log the deleted item
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item' });
  }
}; 

export const getLowStockItems = async (req, res) => {
  try {
    // Fetch items where openingQty is less than or equal to minStock
    const lowStockItems = await Item.find({ $expr: { $lte: ["$openingQty", "$minStock"] } });
    res.status(200).json({ success: true, data: lowStockItems });
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { additionalStock } = req.body; // Get the additional stock from the request body

    if (typeof additionalStock !== 'number') {
      return res.status(400).json({ message: 'Invalid additional stock value' });
    }

    // Find the item and increment the stock level
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $inc: { openingQty: additionalStock } }, // Increment the stock level
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getExpiredItems = async (req, res) => {
  try {
    const today = new Date();
    // Only get items that have an expiryDate and are expired (expiryDate <= today)
    // Exclude items that do NOT have an expiryDate (i.e., only get expired items)
    const expiredItems = await Item.find({
      expiryDate: { $exists: true, $ne: null, $lte: today }
    });
    res.status(200).json({ success: true, data: expiredItems });
  } catch (error) {
    console.error("Error fetching expired items:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
