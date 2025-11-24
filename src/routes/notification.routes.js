import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { deleteNotification, getNotificationsForUser, markNotificationRead, sendNotification, markAllNotificationsRead } from "../controllers/notification.controller.js";
import { isAdmin, isTeacherOrAdmin } from "../middlewares/role.middlewares.js";
import { ApiError } from "../utils/ApiError.js";
import { Notification } from "../models/notification.models.js";

const router = Router();

const isRecipient = (req, res, next) => {
    if (req.user?._id.toString() === req.params.userId) {
        return next();
    }
    return next(new ApiError(403, "Access denied: not the recipient"));
};

const isNotificationRecipient = async (req, res, next) => {
    try {
       const notif = await Notification.findById(req.params.notificationId).select("recipient");
       if (!notif) throw new ApiError(404, "Notification not found");
       if (notif.recipient.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Access denied: not the notification recipient");
        }
       return next();
    } catch (err) {
        return next(err);
    }
};

router.route("/sendnotification").post(verifyJWT, isTeacherOrAdmin, sendNotification);
router.route("/:userId").get(verifyJWT, isRecipient, getNotificationsForUser);
router.route("/notification-read/:notificationId").post(verifyJWT, isNotificationRecipient, markNotificationRead);
router.route("/:userId/mark-all-read").post(verifyJWT, isRecipient, markAllNotificationsRead);
router.route("/notification-delete/:notificationId").delete(verifyJWT, isNotificationRecipient, deleteNotification);


export default router;