import { Router } from 'express';
const router = Router();
import { addItem, deleteItems, getExpiredItems, getItems, getLowStockItems, updateItem } from '../controllers/itemController.js';
import { getMedications } from '../controllers/medicationController.js';
import { getConsumables } from '../controllers/consumablesControlllers.js';
import { getGenerals } from '../controllers/generalControllers.js';


// GET all items
router.get('/',getItems);

// Define the route for low stock items
router.get("/:id", getLowStockItems);
router.get('/expired', getExpiredItems);

// POST new item with detailed logging
router.post('/',addItem);

router.post('/', getMedications);
router.post('/', getConsumables);
router.post('/', getGenerals);
router.patch('/:id', updateItem); // Assuming you want to use the same controller for patching as well
router.delete('/:id', deleteItems)
export default router;

// Alternatively, you could use default export:
// export default router;

