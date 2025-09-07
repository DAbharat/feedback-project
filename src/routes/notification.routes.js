import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { deleteNotification, getNotificationsForUser, markNotificationRead, sendNotification } from "../controllers/notification.controller.js";
import { isAdmin, isTeacherOrAdmin } from "../middlewares/role.middlewares.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();

const isRecipient = (req, res, next) => {
    if (req.user?._id.toString() === req.params.userId) {
        return next();
    }
    return next(new ApiError(403, "Access denied: not the recipient"));
};

router.route("/sendnotification").post(verifyJWT, isTeacherOrAdmin, sendNotification);
router.route("/:userId").get(verifyJWT, isRecipient, getNotificationsForUser);
router.route("/notification-read/:notificationId").post(verifyJWT, isRecipient, markNotificationRead);
router.route("/notification-delete/:notificationId").delete(verifyJWT, isRecipient, deleteNotification);


export default router;