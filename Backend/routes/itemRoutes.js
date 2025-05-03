// // import express from "express";
// // import { addItem } from "../controllers/itemController.js";
// // import upload from "../middlewares/uploadMiddleware.js";

// // const router = express.Router();

// // /**
// //  * @swagger
// //  * tags:
// //  *   name: Items
// //  *   description: API for managing inventory items
// //  */

// // /**
// //  * @swagger
// //  * /api/items:
// //  *   post:
// //  *     summary: Add a new item to the inventory
// //  *     description: Upload an item with an optional image.
// //  *     tags: [Items]
// //  *     consumes:
// //  *       - multipart/form-data
// //  *     parameters:
// //  *       - in: formData
// //  *         name: itemName
// //  *         type: string
// //  *         required: true
// //  *         description: Name of the item.
// //  *       - in: formData
// //  *         name: category
// //  *         type: string
// //  *         required: true
// //  *         description: Category of the item.
// //  *       - in: formData
// //  *         name: enabled
// //  *         type: string
// //  *         enum: [Service, Product]
// //  *         description: Specifies whether the item is a service or a product.
// //  *       - in: formData
// //  *         name: openingQty
// //  *         type: number
// //  *         required: false
// //  *         description: Initial quantity of the item.
// //  *       - in: formData
// //  *         name: minStock
// //  *         type: number
// //  *         required: false
// //  *         description: Minimum stock level before restocking.
// //  *       - in: formData
// //  *         name: date
// //  *         type: string
// //  *         format: date
// //  *         required: false
// //  *         description: The date the item was added.
// //  *       - in: formData
// //  *         name: itemCode
// //  *         type: string
// //  *         required: false
// //  *         description: Unique item code.
// //  *       - in: formData
// //  *         name: image
// //  *         type: file
// //  *         required: false
// //  *         description: Image of the item (JPEG, PNG, JPG).
// //  *     responses:
// //  *       201:
// //  *         description: Item successfully added.
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 message:
// //  *                   type: string
// //  *                   example: Item added successfully
// //  *       400:
// //  *         description: Bad request, missing required fields.
// //  *       500:
// //  *         description: Internal server error.
// //  */
// // router.post("/", upload.single("image"), addItem);

// // export default router;




// // import express from "express";
// // import { getItems, addItem } from "../controllers/itemController.js";

// // const router = express.Router();

// // /**
// //   @swagger
// //  * tags:
// //  *   name: Items
// //  *   description: API for managing inventory items
// //  */

// // /**
// //  * @swagger
// //  * /api/items:
// //  *   get:
// //  *     summary: Get all inventory items
// //  *     tags: [Items]
// //  *     responses:
// //  *       200:
// //  *         description: List of all items
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/", getItems);

// // /**
// //  * @swagger
// //  * /api/items:
// //  *   post:
// //  *     summary: Add a new item
// //  *     tags: [Items]
// //  *     requestBody:
// //  *       required: true
// //  *       content:
// //  *         application/json:
// //  *           schema:
// //  *             type: object
// //  *             properties:
// //  *               name:
// //  *                 type: string
// //  *               quantity:
// //  *                 type: number
// //  *               salePrice:
// //  *                 type: number
// //  *               purchasePrice:
// //  *                 type: number
// //  *     responses:
// //  *       201:
// //  *         description: Item added successfully
// //  *       400:
// //  *         description: Bad request
// //  *       500:
// //  *         description: Server error
// //  */
// // router.post("/", addItem);

// // export default router;

// // routes/itemRoutes.js
// import { Router } from 'express';
// const router = Router();
// import ItemSchema from '../models/Item.js';
// import multer, { diskStorage } from 'multer';
// import { extname } from 'path';
// import { existsSync, mkdirSync } from 'fs';
// import { getItems, addItem } from "../controllers/itemController.js";
// // import AddItems from '../../Frontend/src/pages/AddItems.jsx';

// // router.get('/', getItems);

// // GET /api/items
// router.get('/', async (req, res) => {
//     try {
//       const items = await ItemSchema.find({});
//       res.json(items);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   })
// router.post('/', AddItems)
// // Configure multer for file uploads
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
//  ;
//    cb(null, uniqueSuffix + extname(file.originalname));
//   }
// })
// const upload = multer({ 
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//       if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//       } else {
//         cb(new Error('Only images are allowed!'), false);
//       }
//     }
//   });

// // Add new item
// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     const { 
//       itemName, 
//       category, 
//       openingQty, 
//       minStock,
//       itemCode,
//       enabled 
//     } = req.body;

//     // Basic validation
//     if (!itemName || !category || !itemCode) {
//       return res.status(400).json({ message: 'Required fields are missing' });
//     }

//     const newItem = new Item({
//       name: itemName,
//       category,
//       itemCode,
//       quantity: Number(openingQty) || 0,
//       lowStockThreshold: Number(minStock) || 0,
//       isService: enabled === 'Service',
//       price: 0, // Default price, can be updated later
//       ...(req.file && { imageUrl: `/uploads/items/${req.file.filename}` })
//     });

//     await newItem.save();
//     res.status(201).json(newItem);
//   } catch (err) {
//     // Handle duplicate item code
//     if (err.code === 11000) {
//       return res.status(400).json({ message: 'Item code already exists' });
//     }
//     res.status(400).json({ message: err.message });
//   }
// });

// import { Router } from 'express';
// const router = Router();
// import Item from '../models/Item.js'; // Changed from ItemSchema to Item (assuming this is your model)
// import multer from 'multer';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { existsSync, mkdirSync } from 'fs';
// import { getItems, addItem } from "../controllers/itemController.js";

// // GET all items
// // router.get('/', async (req, res) => {
// //     try {
// //         const items = await Item.find({});
// //         res.json(items);
// //     } catch (err) {
// //         res.status(500).json({ error: err.message });
// //     }
// // });

// // In your backend route handler
// router.get('/api/items', async (req, res) => {
//   try {
//     console.log('Attempting to fetch items...');
//     const items = await Item.find({});
//     console.log(`Found ${items.length} items`);
//     res.json(items);
//   } catch (err) {
//     console.error('Database error:', err);
//     res.status(500).json({ 
//       message: 'Internal Server Error',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// });

// // Configure multer for file uploads
// const storage = diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = 'uploads/items';
//         if (!existsSync(uploadDir)) {
//             mkdirSync(uploadDir, { recursive: true });
//         }
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + extname(file.originalname));
//     }
// });

// const upload = multer({ 
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only images are allowed!'), false);
//         }
//     }
// });

// // POST new item
// router.post('/', upload.single('image'), async (req, res) => {
//     try {
//         const { 
//             itemName, 
//             category, 
//             openingQty, 
//             minStock,
//             itemCode,
//             enabled 
//         } = req.body;
//         console.log("Received data:", req.body); // Debug: Log incoming data
//         console.log("File received:", req.file); // Dbug: Log Uploaded file
//         // Basic validation
//         if (!itemName || !category || !itemCode) {
//             return res.status(400).json({ message: 'Required fields are missing' });
//         }

//         const newItem = new Item({
//             name: itemName,
//             category,
//             itemCode,
//             quantity: Number(openingQty) || 0,
//             lowStockThreshold: Number(minStock) || 0,
//             isService: enabled === 'Service',
//             price: 0, // Default price, can be updated later
//             ...(req.file && { imageUrl: `/uploads/items/${req.file.filename}` })
//         });

//         await newItem.save();
//         res.status(201).json(newItem);
//     } catch (err) {
//         // Handle duplicate item code
//         if (err.code === 11000) {
//             return res.status(400).json({ message: 'Item code already exists' });
//         }
//         res.status(400).json({ message: err.message });
//     }
// });

// // Export the router directly (named export)
// export default  router 



import { Router } from 'express';
const router = Router();
import { addItem, deleteItems, getItems, getLowStockItems, updateItem } from '../controllers/itemController.js';
import { getMedications } from '../controllers/medicationController.js';
import { getConsumables } from '../controllers/consumablesControlllers.js';
import { getGenerals } from '../controllers/generalControllers.js';

// // Debugging route
// router.get('/test', (req, res) => {
//   console.log('Test route hit!');
//   res.json({ message: 'API is working!' });
// });

// GET all items with enhanced error handling
// router.get('/items', async (req, res) => {
//   console.log(' Attempting to fetch items...');
//   try {
//     console.log('Checking Item model:', Item ? 'Exists' : 'UNDEFINED');
//     const items = await Item.find({}).maxTimeMS(10000);
//     console.log(` Found ${items.length} items`);
//     res.json(items);
//   } catch (err) {
//     console.error(' Database error:', err.message);
//     console.error('Full error stack:', err.stack);
//     res.status(500).json({ 
//       error: 'Database operation failed',
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// });

// GET all items
router.get('/',getItems);

// Define the route for low stock items
router.get("/:id", getLowStockItems);


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

