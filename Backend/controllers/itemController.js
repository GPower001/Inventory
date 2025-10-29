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
    const { name, category, openingQty, minStock, expiryDate, itemCode, price } = req.body;

    if (!name || !category || !openingQty || !minStock) {
      return res.status(400).json({
        message: "Name, category, openingQty, and minStock are required",
      });
    }

    const cleanName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
    const branchId = req.user.branchId;

    // Check for duplicate name+category within branch (case-insensitive)
    const existingItemByName = await Item.findOne({
      name: { $regex: new RegExp(`^${cleanName}$`, "i") },
      category,
      branchId,
    });

    if (existingItemByName) {
      return res.status(400).json({ message: "Item already exists" });
    }

    //  Check for duplicate itemCode
    if (itemCode) {
      const existingItemByCode = await Item.findOne({
        itemCode: itemCode.trim(),
        branchId,
      });
      if (existingItemByCode) {
        return res.status(400).json({ message: "Item already exists" });
      }
    }

    //  Validate expiry date
    let parsedExpiry = undefined;
    if (expiryDate) {
      parsedExpiry = new Date(expiryDate);
      if (isNaN(parsedExpiry.getTime())) {
        return res.status(400).json({ message: "Invalid expiry date format" });
      }
    }

    //  Create and save new item
    const newItem = new Item({
      name: cleanName,
      category,
      openingQty,
      minStock,
      itemCode: itemCode ? itemCode.trim() : undefined,
      expiryDate: parsedExpiry,
      branchId,
      image: req.file ? `/uploads/items/${req.file.filename}` : null,
      price
    });

    const savedItem = await newItem.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    console.error("Add Item Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Item already exists" });
    }

    res.status(500).json({ message: "Server error", error: error.message });
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
// export const updateItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { additionalStock } = req.body;

//     if (typeof additionalStock !== "number") {
//       return res.status(400).json({ message: "Invalid additional stock value" });
//     }

//     const updatedItem = await Item.findOneAndUpdate(
//       { _id: id, branchId: req.user.branchId },
//       { $inc: { openingQty: additionalStock } },
//       { new: true }
//     );

//     if (!updatedItem) {
//       return res.status(404).json({ message: "Item not found in this branch" });
//     }

//     res.status(200).json({ success: true, data: updatedItem });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };


/**
 * @desc Update item (stock, minStock, price, expiryDate, etc.)
 * @route PUT /api/items/:id
 * @access Private
 */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { additionalStock, minStock, price, expiryDate, name, category, itemCode } = req.body;

    const item = await Item.findOne({ _id: id, branchId: req.user.branchId });

    if (!item) {
      return res.status(404).json({ message: "Item not found in this branch" });
    }

    // ✅ Update stock if additionalStock is provided
    if (typeof additionalStock === "number") {
      item.openingQty += additionalStock;
    }

    // ✅ Update minStock if provided
    if (typeof minStock === "number" && minStock >= 0) {
      item.minStock = minStock;
    }

    // ✅ Update price if provided
    if (typeof price === "number" && price >= 0) {
      item.price = price;
    }

    // ✅ Update expiryDate if provided
    if (expiryDate) {
      const parsedExpiry = new Date(expiryDate);
      if (!isNaN(parsedExpiry.getTime())) {
        item.expiryDate = parsedExpiry;
      } else {
        return res.status(400).json({ message: "Invalid expiry date format" });
      }
    }

    //  Update name if provided (with duplicate check)
    if (name && name.trim()) {
      const cleanName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
      const cleanCategory = category ? category.trim().toLowerCase() : item.category;
      
      const duplicate = await Item.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${cleanName}$`, "i") },
        category: { $regex: new RegExp(`^${cleanCategory}$`, "i") },
        branchId: req.user.branchId,
      });

      if (duplicate) {
        return res.status(400).json({ message: "Item with this name and category already exists" });
      }

      item.name = cleanName;
    }

    //  Update category if provided
    if (category && category.trim()) {
      item.category = category.trim().toLowerCase();
    }

    //  Update itemCode if provided (with duplicate check)
    if (itemCode && itemCode.trim()) {
      const duplicate = await Item.findOne({
        _id: { $ne: id },
        itemCode: itemCode.trim(),
        branchId: req.user.branchId,
      });

      if (duplicate) {
        return res.status(400).json({ message: "Item code already exists" });
      }

      item.itemCode = itemCode.trim();
    }

    //  Update image if new file uploaded
    if (req.file) {
      item.image = `/uploads/items/${req.file.filename}`;
    }

    const updatedItem = await item.save();

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    console.error("Update Item Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
