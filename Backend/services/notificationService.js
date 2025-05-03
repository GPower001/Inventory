// import Notification from "../models/notificationModel.js";

// const createNotification = async (notificationData) => {
//   try {
//     const notification = new Notification(notificationData);
//     await notification.save();
//     return notification;
//   } catch (error) {
//     throw new Error("Error creating notification: " + error.message);
//   }
// };

// const getAllNotifications = async () => {
//   try {
//     const notifications = await Notification.find().sort({ createdAt: -1 });
//     return notifications;
//   } catch (error) {
//     throw new Error("Error fetching notifications: " + error.message);
//   }
// };

// const deleteNotification = async (notificationId) => {
//   try {
//     const result = await Notification.findByIdAndDelete(notificationId);
//     if (!result) {
//       throw new Error("Notification not found");
//     }
//     return result;
//   } catch (error) {
//     throw new Error("Error deleting notification: " + error.message);
//   }
// };

// export default {
//   createNotification,
//   getAllNotifications,
//   deleteNotification,
// };


import Notification from "../models/notificationModel.js";

// Create a new notification
const createNotification = async (notificationData) => {
  try {
    // Validate notification data (optional, based on your schema)
    if (!notificationData || !notificationData.message) {
      throw new Error("Notification data is invalid or missing required fields");
    }

    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error.message); // Log the error
    throw new Error("Error creating notification: " + error.message);
  }
};

// Retrieve all notifications
const getAllNotifications = async () => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error.message); // Log the error
    throw new Error("Error fetching notifications: " + error.message);
  }
};

// Delete a notification by ID
const deleteNotification = async (notificationId) => {
  try {
    // Validate the notification ID
    if (!notificationId) {
      throw new Error("Notification ID is required");
    }

    const result = await Notification.findByIdAndDelete(notificationId);
    if (!result) {
      throw new Error("Notification not found");
    }
    return result;
  } catch (error) {
    console.error("Error deleting notification:", error.message); // Log the error
    throw new Error("Error deleting notification: " + error.message);
  }
};

export default {
  createNotification,
  getAllNotifications,
  deleteNotification,
};