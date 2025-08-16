import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getFilteredFeedbacks, getFeedbackStats, getFeedbackTrends, getTopKeywords, getFeedbackByStatus } from "../controllers/feedback.controller.js";

const router = Router();

router.get("/feedbacks", verifyJWT, getFilteredFeedbacks);
router.get("/feedbacks/stats", verifyJWT, getFeedbackStats);
router.get("/feedbacks/trends", verifyJWT, getFeedbackTrends);
router.get("/feedbacks/top-keywords", verifyJWT, getTopKeywords);
router.get("/feedbacks/status", verifyJWT, getFeedbackByStatus);

export default router;