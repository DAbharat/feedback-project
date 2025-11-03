import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getFilteredFeedbacks, getFeedbackTrends, getTopKeywords, getFeedbackByStatus, submitGeneralFeedback, getAllTeachers, markFeedbackAsRead, replyToFeedback, getFeedbackById } from "../controllers/feedback.controller.js";
import { isTeacherOrAdmin, isAdmin } from "../middlewares/role.middlewares.js";

const router = Router();
router.route("/teachers").get(verifyJWT, getAllTeachers);
router.route("/submitresponse").post(verifyJWT, submitGeneralFeedback);
router.route("/feedbacks").get(verifyJWT, isTeacherOrAdmin, getFilteredFeedbacks);
router.route("/:id/mark-read").post(verifyJWT, isTeacherOrAdmin, markFeedbackAsRead);
router.route("/:id/reply").post(verifyJWT, isTeacherOrAdmin, replyToFeedback);
router.route("/:id").get(verifyJWT, isAdmin, getFeedbackById);
//router.route("/feedbacks/stats").get(verifyJWT, isTeacherOrAdmin, getFeedbackStats);
router.route("/feedbacks/trends").get(verifyJWT, isTeacherOrAdmin, getFeedbackTrends);
router.route("/feedbacks/top-keywords").get(verifyJWT, isTeacherOrAdmin, getTopKeywords);
router.route("/feedbacks/status").get(verifyJWT, isTeacherOrAdmin, getFeedbackByStatus);

export default router;