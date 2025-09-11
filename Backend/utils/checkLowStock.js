// import notificationService from "../services/notificationService.js";
// import Item from "../models/Item.js";

// const checkLowStock = async () => {
//   try {
//     // Find items where the stock is less than or equal to the minimum stock
//     const lowStockItems = await Item.find({ openingQty: { $lte: "$minStock" } });

//     for (const item of lowStockItems) {
//       // Check if a notification already exists for this item
//       const existingNotification = await Notification.findOne({ item: item.name, type: "low-stock" });

//       if (!existingNotification) {
//         // Use the notificationService to create a new notification
//         await notificationService.createNotification({
//           type: "low-stock",
//           message: `${item.name} is running low (${item.openingQty} units left)`,
//           item: item.name,
//           count: item.openingQty,
//         });

//         console.log(`Notification created for low stock: ${item.name}`);
//       }
//     }
//   } catch (error) {
//     console.error("Error checking low stock:", error.message);
//   }
// };

// export default checkLowStock;

// import Notification from "../models/notificationModel.js";
// import Item from "../models/Item.js";

// const checkLowStock = async () => {
//   try {
//     // Find items where the stock is less than or equal to the minimum stock
//     const lowStockItems = await Item.find({ openingQty: { $lte: "$minStock" } });

//     for (const item of lowStockItems) {
//       // Check if a notification already exists for this item
//       const existingNotification = await Notification.findOne({ item: item.name, type: "low-stock" });

//       if (!existingNotification) {
//         // Create a new notification
//         await Notification.create({
//           type: "low-stock",
//           message: `${item.name} is running low (${item.openingQty} units left)`,
//           item: item.name,
//           count: item.openingQty,
//         });

//         console.log(`Notification created for low stock: ${item.name}`);
//       }
//     }
//   } catch (error) {
//     console.error("Error checking low stock:", error.message);
//   }
// };

// export default checkLowStock;

import Notification from "../models/notificationModel.js";
import Item from "../models/Item.js";

const checkLowStock = async (io, itemId = null) => {
  try {
    let lowStockItems;

    if (itemId) {
      const item = await Item.findById(itemId);
      lowStockItems = item && item.openingQty <= item.minStock ? [item] : [];
    } else {
      lowStockItems = await Item.find({
        $expr: { $lte: ["$openingQty", "$minStock"] },
      });
    }

    console.log("Low Stock Items:", lowStockItems);

    for (const item of lowStockItems) {
      // Check for existing low-stock notification
      const existingNotification = await Notification.findOne({ item: item.name, type: "low-stock" });

      if (existingNotification) {
        if (existingNotification.isRead) {
          existingNotification.isRead = false;
          existingNotification.message = `${item.name} is running low (${item.openingQty} units left)`;
          existingNotification.count = item.openingQty;
          await existingNotification.save();

          // Emit to the specific branch room
          io.to(item.branchId.toString()).emit("new-notification", existingNotification);
        }
      } else {
        const notification = await Notification.create({
          type: "low-stock",
          message: `${item.name} is running low (${item.openingQty} units left)`,
          item: item.name,
          count: item.openingQty,
          branchId: item.branchId, // ensure branchId is stored
        });

        // Emit to the specific branch room
        io.to(item.branchId.toString()).emit("new-notification", notification);
      }
    }
  } catch (error) {
    console.error("Error checking low stock:", error.message);
  }
};

export default checkLowStock;



// const checkLowStock = async () => {
//   try {
//     // Find items where the stock is less than or equal to the minimum stock
//     const lowStockItems = await Item.find({
//       $expr: { $lte: ["$openingQty", "$minStock"] }, // Compare openingQty with minStock
//     });
//     console.log("Low Stock Items:", lowStockItems);

//     for (const item of lowStockItems) {
//       // Check if a notification already exists for this item
//       const existingNotification = await Notification.findOne({ item: item.name, type: "low-stock" });

//       if (!existingNotification) {
//         const notification = await Notification.create({
//           type: "low-stock",
//           message: `${item.name} is running low (${item.openingQty} units left)`,
//           item: item.name,
//           count: item.openingQty,
//         });
//         console.log("Notification Created:", notification);
//       }
//     }
//   } catch (error) {
//     console.error("Error checking low stock:", error.message);
//   }
// };

// export default checkLowStock;