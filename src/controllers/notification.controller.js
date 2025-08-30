import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Notification } from "../models/notification.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const sendNotification = asyncHandler(async (req, res) => {
	const { recipient, type, message, relatedId, relatedModel } = req.body;
	if (!recipient || !type || !message) {
		throw new ApiError(400, "Recipient, type, and message are required");
	}
	const notification = await Notification.create({ recipient, type, message, relatedId, relatedModel });
	res.status(201).json(new ApiResponse(201, notification, "Notification sent"));
});

const getNotificationsForUser = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
	res.json(new ApiResponse(200, notifications, "User notifications"));
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
    res.json(new ApiResponse(200, null, "Notification deleted"));
});

export {
	sendNotification,
	getNotificationsForUser,
	markNotificationRead,
	deleteNotification
}
