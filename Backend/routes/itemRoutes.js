// import { Router } from 'express';
// const router = Router();
// import { addItem, deleteItems, getExpiredItems, getItems, getLowStockItems, updateItem } from '../controllers/itemController.js';
// import { getMedications } from '../controllers/medicationController.js';
// import { getConsumables } from '../controllers/consumablesControlllers.js';
// import { getGenerals } from '../controllers/generalControllers.js';


// // GET all items
// router.get('/',getItems);

// // Define the route for low stock items
// router.get("/:id", getLowStockItems);
// router.get('/expired', getExpiredItems);

// // POST new item with detailed logging
// router.post('/',addItem);

// router.post('/', getMedications);
// router.post('/', getConsumables);
// router.post('/', getGenerals);
// router.patch('/:id', updateItem); // Assuming you want to use the same controller for patching as well
// router.delete('/:id', deleteItems)
// export default router;




import { Router } from "express";
import {
  addItem,
  deleteItems,
  getExpiredItems,
  getItems,
  getLowStockItems,
  updateItem,
  getGenerals,
  getConsumables,
  getMedications,
} from "../controllers/itemController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

// GET all items for branch
router.get("/", authenticate, getItems);

// GET low stock items
router.get("/low-stock", authenticate, getLowStockItems);

// GET expired items
router.get("/expired", authenticate, getExpiredItems);

// GET category-based items
router.get("/generals", authenticate, getGenerals);
router.get("/consumables", authenticate, getConsumables);
router.get("/medications", authenticate, getMedications);

// POST new item
router.post("/", authenticate, addItem);

// PATCH update stock
router.patch("/:id", authenticate, updateItem);

// DELETE item
router.delete("/:id", authenticate, deleteItems);

export default router;


// Alternatively, you could use default export:
// export default router;

