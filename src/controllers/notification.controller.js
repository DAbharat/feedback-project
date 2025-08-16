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
	const { id } = req.params;
	const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
	if (!notification) throw new ApiError(404, "Notification not found");
	res.json(new ApiResponse(200, notification, "Notification marked as read"));
});


export {
	sendNotification,
	getNotificationsForUser,
	markNotificationRead
}
