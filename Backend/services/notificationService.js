import Notification from "../models/notificationModel.js";

const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    throw new Error("Error creating notification: " + error.message);
  }
};

const getAllNotifications = async () => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return notifications;
  } catch (error) {
    throw new Error("Error fetching notifications: " + error.message);
  }
};

const deleteNotification = async (notificationId) => {
  try {
    const result = await Notification.findByIdAndDelete(notificationId);
    if (!result) {
      throw new Error("Notification not found");
    }
    return result;
  } catch (error) {
    throw new Error("Error deleting notification: " + error.message);
  }
};

export default {
  createNotification,
  getAllNotifications,
  deleteNotification,
};