import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getNotificationsForUser, markNotificationRead, sendNotification } from "../controllers/notification.controller.js";

const router = Router();

router.route("/sendnotification").post(verifyJWT, sendNotification);
router.route("/notifications/:userId").get(verifyJWT, getNotificationsForUser);
router.route("/notification-read/:notificationId").post(verifyJWT, markNotificationRead);


export default router;