// Mark all notifications as read for a user
const markAllNotificationsRead = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (req.user._id.toString() !== userId) {
        throw new ApiError(403, "Access denied: not the recipient");
    }
    await Notification.updateMany({ recipient: userId, isRead: false }, { $set: { isRead: true } });
    res.json(new ApiResponse(200, null, "All notifications marked as read"));
});
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Notification } from "../models/notification.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";


const sendNotification = asyncHandler(async (req, res) => {
    const { recipient, type, message, relatedId, relatedModel } = req.body;
    if (!recipient || !type || !message) {
        throw new ApiError(400, "Recipient, type, and message are required");
    }
    const notification = await Notification.create({ recipient, type, message, relatedId, relatedModel });
    logger.info(`Notification sent to user ${recipient}: ${message}`);
    res.status(201).json(new ApiResponse(201, notification, "Notification sent"));
});

const getNotificationsForUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await Notification.countDocuments({ recipient: userId });
    logger.info(`Fetched ${notifications.length} notifications for user ${userId}`);
    res.json({
        success: true,
        data: notifications,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    });
});

const markNotificationRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new ApiError(404, "Notification not found");
    if (notification.recipient.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied: not the recipient");
    }
    notification.isRead = true;
    await notification.save();
    res.json(new ApiResponse(200, notification, "Notification marked as read"));
});

const deleteNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new ApiError(404, "Notification not found");
    if (notification.recipient.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied: not the recipient");
    }
    await notification.remove();
    logger.info(`Notification deleted for user ${notification.recipient}`);
    res.json(new ApiResponse(200, null, "Notification deleted"));
});

export {
    sendNotification,
    getNotificationsForUser,
    markNotificationRead,
    deleteNotification
    ,markAllNotificationsRead
}
