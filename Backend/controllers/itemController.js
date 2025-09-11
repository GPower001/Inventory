// import multer from 'multer';
// import Item from "../models/Item.js";
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { existsSync, mkdirSync } from 'fs';


// // File upload configuration
// const storage = diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'uploads/items';
//     if (!existsSync(uploadDir)) {
//       mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + extname(file.originalname));
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only images are allowed!'), false);
//     }
//   }
// });

// /**
//  * @desc Get all items
//  * @route GET /api/items
//  * @access Public
//  */
// export const getItems = async (req, res) => {
//   try {
//     const items = await Item.find({});
//     res.status(200).json({success: true, data:items});
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// /**
//  * @desc Add new item
//  * @route POST /api/items
//  * @access Public
//  */
// // export const addItem = async (req, res) => {
// //   try {
// //     console.log("Request Body:", req.body); // Log the incoming request body

// //     const items = req.body;

// //     if (!items.name || !items.category || !items.openingQty || !items.minStock) {
// //       return res.status(400).json({ message: "Name and quantity are required" });
// //     }

// //     const newItem = new Item(items);
// //     console.log("New Item to Save:", newItem); // Log the item before saving

// //     const savedItem = await newItem.save();
// //     res.status(201).json({ success: true, data: savedItem });
// //   } catch (error) {
// //     console.error("Error in Creating item:", error); // Log the full error
// //     if (error.code === 11000) {
// //       return res.status(400).json({ message: "Item code already exists" });
// //     }
// //     res.status(500).json({ message: "Server error", error });
// //   }
// // };

// export const addItem = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body); // Log the incoming request body

//     const items = req.body;

//     if (!items.name || !items.category || !items.openingQty || !items.minStock) {
//       return res.status(400).json({ message: "Name and quantity are required" });
//     }

//     // Handle expiration date if provided
//     let expiryDate = undefined;
//     if (items.expiryDate) {
//       expiryDate = new Date(items.expiryDate);
//       if (isNaN(expiryDate.getTime())) {
//         return res.status(400).json({ message: "Invalid expiry date format" });
//       }
//     }

//     const newItem = new Item({
//       ...items,
//       expiryDate: expiryDate, // Will be undefined if not provided
//     });
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

// export const deleteItems = async (req, res) => {
//   try {
//     const { id } = req.params;
   
//     const deletedItem = await Item.findByIdAndDelete(id); // Delete item by ID
//     console.log("Deleted Item:", deletedItem); // Log the deleted item
//     if (!deletedItem) {
//       return res.status(404).json({ message: 'Item not found' });
//     }
//     res.status(200).json({ message: 'Item deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting item:', error);
//     res.status(500).json({ message: 'Failed to delete item' });
//   }
// }; 

// export const getLowStockItems = async (req, res) => {
//   try {
//     // Fetch items where openingQty is less than or equal to minStock
//     const lowStockItems = await Item.find({ $expr: { $lte: ["$openingQty", "$minStock"] } });
//     res.status(200).json({ success: true, data: lowStockItems });
//   } catch (error) {
//     console.error("Error fetching low stock items:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };
// export const updateItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { additionalStock } = req.body; // Get the additional stock from the request body

//     if (typeof additionalStock !== 'number') {
//       return res.status(400).json({ message: 'Invalid additional stock value' });
//     }

//     // Find the item and increment the stock level
//     const updatedItem = await Item.findByIdAndUpdate(
//       id,
//       { $inc: { openingQty: additionalStock } }, // Increment the stock level
//       { new: true } // Return the updated document
//     );

//     if (!updatedItem) {
//       return res.status(404).json({ message: 'Item not found' });
//     }

//     res.status(200).json({ success: true, data: updatedItem });
//   } catch (error) {
//     console.error("Error updating item:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// export const getExpiredItems = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison

//     // Only get items that have an expiryDate and are expired (expiryDate < today)
//     // Exclude items that do NOT have an expiryDate (i.e., only get expired items)
//     const expiredItems = await Item.find({
//       expiryDate: { $exists: true, $ne: null, $lt: today }
//     });

//     res.status(200).json({ success: true, data: expiredItems });
//   } catch (error) {
//     console.error("Error fetching expired items:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };


// import multer, { diskStorage } from "multer";
// import Item from "../models/Item.js";
// import { extname } from "path";
// import { existsSync, mkdirSync } from "fs";

// /* ============================
//    FILE UPLOAD CONFIG
// ============================ */
// const storage = diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = "uploads/items";
//     if (!existsSync(uploadDir)) {
//       mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix =
//       Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + extname(file.originalname));
//   },
// });

// export const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only images are allowed!"), false);
//     }
//   },
// });

// /* ============================
//    CONTROLLERS
// ============================ */

// /**
//  * @desc Get all items for branch
//  * @route GET /api/items
//  * @access Private
//  */
// export const getItems = async (req, res) => {
//   try {
//     const items = await Item.find({ branchId: req.user.branchId });
//     res.status(200).json({ success: true, data: items });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// /**
//  * @desc Add new item
//  * @route POST /api/items
//  * @access Private
//  */
// export const addItem = async (req, res) => {
//   try {
//     const items = req.body;

//     if (
//       !items.name ||
//       !items.category ||
//       !items.openingQty ||
//       !items.minStock
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Name, category, and quantity are required" });
//     }

//     // Handle expiration date if provided
//     let expiryDate = undefined;
//     if (items.expiryDate) {
//       expiryDate = new Date(items.expiryDate);
//       if (isNaN(expiryDate.getTime())) {
//         return res
//           .status(400)
//           .json({ message: "Invalid expiry date format" });
//       }
//     }

//     const newItem = new Item({
//       ...items,
//       expiryDate,
//       branchId: req.user.branchId, // ✅ ensure branch ownership
//     });

//     const savedItem = await newItem.save();
//     res.status(201).json({ success: true, data: savedItem });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res
//         .status(400)
//         .json({ message: "Item code already exists" });
//     }
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// /**
//  * @desc Delete item
//  * @route DELETE /api/items/:id
//  * @access Private
//  */
// export const deleteItems = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedItem = await Item.findOneAndDelete({
//       _id: id,
//       branchId: req.user.branchId, // ✅ restrict delete to branch
//     });

//     if (!deletedItem) {
//       return res
//         .status(404)
//         .json({ message: "Item not found in this branch" });
//     }

//     res.status(200).json({ message: "Item deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete item", error });
//   }
// };

// /**
//  * @desc Get low stock items
//  * @route GET /api/items/low-stock
//  * @access Private
//  */
// export const getLowStockItems = async (req, res) => {
//   try {
//     const lowStockItems = await Item.find({
//       branchId: req.user.branchId,
//       $expr: { $lte: ["$openingQty", "$minStock"] },
//     });

//     res.status(200).json({ success: true, data: lowStockItems });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// /**
//  * @desc Update item stock
//  * @route PUT /api/items/:id
//  * @access Private
//  */
// export const updateItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { additionalStock } = req.body;

//     if (typeof additionalStock !== "number") {
//       return res
//         .status(400)
//         .json({ message: "Invalid additional stock value" });
//     }

//     const updatedItem = await Item.findOneAndUpdate(
//       { _id: id, branchId: req.user.branchId }, // ✅ restrict update to branch
//       { $inc: { openingQty: additionalStock } },
//       { new: true }
//     );

//     if (!updatedItem) {
//       return res
//         .status(404)
//         .json({ message: "Item not found in this branch" });
//     }

//     res.status(200).json({ success: true, data: updatedItem });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// /**
//  * @desc Get expired items
//  * @route GET /api/items/expired
//  * @access Private
//  */
// export const getExpiredItems = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const expiredItems = await Item.find({
//       branchId: req.user.branchId,
//       expiryDate: { $exists: true, $ne: null, $lt: today },
//     });

//     res.status(200).json({ success: true, data: expiredItems });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };


import multer, { diskStorage } from "multer";
import Item from "../models/Item.js";
import { extname } from "path";
import { existsSync, mkdirSync } from "fs";

/* ============================
   FILE UPLOAD CONFIG
============================ */
const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/items";
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"), false);
    }
  },
});

/* ============================
   CONTROLLERS
============================ */

/**
 * @desc Get all items for branch
 * @route GET /api/items
 * @access Private
 */
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ branchId: req.user.branchId });
    res.status(200).json({ success: true, data: items || [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Add new item
 * @route POST /api/items
 * @access Private
 */
export const addItem = async (req, res) => {
  try {
    const { name, category, openingQty, minStock, expiryDate, itemCode } = req.body;

    if (!name || !category || !openingQty || !minStock) {
      return res
        .status(400)
        .json({ message: "Name, category, openingQty and minStock are required" });
    }

    // ✅ Ensure itemCode is unique within the same branch
    if (itemCode) {
      const existingItem = await Item.findOne({
        itemCode,
        branchId: req.user.branchId,
      });

      if (existingItem) {
        return res.status(400).json({
          message: "Item code already exists in this branch",
        });
      }
    }

    let parsedExpiry = undefined;
    if (expiryDate) {
      parsedExpiry = new Date(expiryDate);
      if (isNaN(parsedExpiry.getTime())) {
        return res.status(400).json({ message: "Invalid expiry date format" });
      }
    }

    const newItem = new Item({
      name,
      category,
      openingQty,
      minStock,
      itemCode, // ✅ keep the provided code
      expiryDate: parsedExpiry,
      branchId: req.user.branchId,
      image: req.file ? `/uploads/items/${req.file.filename}` : null,
    });

    const savedItem = await newItem.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    if (error.code === 11000) {
      // ✅ fallback in case of index conflict
      return res.status(400).json({
        message: "Item code already exists in this branch",
      });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Delete item
 * @route DELETE /api/items/:id
 * @access Private
 */
export const deleteItems = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Item.findOneAndDelete({
      _id: id,
      branchId: req.user.branchId,
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in this branch" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item", error });
  }
};

/**
 * @desc Get low stock items
 * @route GET /api/items/low-stock
 * @access Private
 */
export const getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Item.find({
      branchId: req.user.branchId,
      $expr: { $lte: ["$openingQty", "$minStock"] },
    });

    res.status(200).json({ success: true, data: lowStockItems || [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Update item stock
 * @route PUT /api/items/:id
 * @access Private
 */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { additionalStock } = req.body;

    if (typeof additionalStock !== "number") {
      return res.status(400).json({ message: "Invalid additional stock value" });
    }

    const updatedItem = await Item.findOneAndUpdate(
      { _id: id, branchId: req.user.branchId },
      { $inc: { openingQty: additionalStock } },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found in this branch" });
    }

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Get expired items
 * @route GET /api/items/expired
 * @access Private
 */
export const getExpiredItems = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredItems = await Item.find({
      branchId: req.user.branchId,
      expiryDate: { $exists: true, $ne: null, $lt: today },
    });

    res.status(200).json({ success: true, data: expiredItems || [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ============================
   CATEGORY-BASED FILTERS
============================ */

/**
 * @desc Get General items
 * @route GET /api/items/general
 * @access Private
 */
export const getGenerals = async (req, res) => {
  try {
    const items = await Item.find({
      branchId: req.user.branchId,
      category: "General",
    });

    res.status(200).json({ success: true, data: items || [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Get Consumables
 * @route GET /api/items/consumables
 * @access Private
 */
export const getConsumables = async (req, res) => {
  try {
    const items = await Item.find({
      branchId: req.user.branchId,
      category: "Consumables",
    });

    res.status(200).json({ success: true, data: items || [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Get Medications
 * @route GET /api/items/medications
 * @access Private
 */
export const getMedications = async (req, res) => {
  try {
    const items = await Item.find({
      branchId: req.user.branchId,
      category: "Medications",
    });

    res.status(200).json({ success: true, data: items || [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
