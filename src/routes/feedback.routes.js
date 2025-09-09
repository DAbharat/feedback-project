import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getFilteredFeedbacks, getFeedbackStats, getFeedbackTrends, getTopKeywords, getFeedbackByStatus} from "../controllers/feedback.controller.js";
import { isTeacherOrAdmin } from "../middlewares/role.middlewares.js";

const router = Router();
router.route("/feedbacks").get(verifyJWT, isTeacherOrAdmin, getFilteredFeedbacks);
router.route("/feedbacks/stats").get(verifyJWT, isTeacherOrAdmin, getFeedbackStats);
router.route("/feedbacks/trends").get(verifyJWT, isTeacherOrAdmin, getFeedbackTrends);
router.route("/feedbacks/top-keywords").get(verifyJWT, isTeacherOrAdmin, getTopKeywords);
router.route("/feedbacks/status").get(verifyJWT, isTeacherOrAdmin, getFeedbackByStatus);

export default router;