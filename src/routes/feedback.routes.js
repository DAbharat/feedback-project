import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getFilteredFeedbacks, getFeedbackStats, getFeedbackTrends, getTopKeywords, getFeedbackByStatus, isTeacherOrAdmin } from "../controllers/feedback.controller.js";

const router = Router();

router.get("/feedbacks", verifyJWT, isTeacherOrAdmin, getFilteredFeedbacks);
router.get("/feedbacks/stats", verifyJWT, isTeacherOrAdmin, getFeedbackStats);
router.get("/feedbacks/trends", verifyJWT, isTeacherOrAdmin, getFeedbackTrends);
router.get("/feedbacks/top-keywords", verifyJWT, isTeacherOrAdmin, getTopKeywords);
router.get("/feedbacks/status", verifyJWT, isTeacherOrAdmin, getFeedbackByStatus);

export default router;