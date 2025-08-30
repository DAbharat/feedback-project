import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { aggregateFormResponses, getFormResponseById, getResponsesForForm, submitFormResponse } from "../controllers/formResponse.controller.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();

const isStudent = (req, res, next) => {
    if (req.user?.role === "student") {
        return next();
    }
    return next(new ApiError(403, "Student access required"));
};

router.route("/submitresponse").post(verifyJWT, isStudent, submitFormResponse);
router.route("/responses/:formId").get(verifyJWT, isStudent, getResponsesForForm);
router.route("/responses/:formId/:responseId").get(verifyJWT, isStudent, getFormResponseById);

const isTeacherOrAdmin = (req, res, next) => {
    if (req.user?.role === "teacher" || req.user?.role === "admin") {
        return next();
    }
    return next(new ApiError(403, "Teacher or admin access required"));
};

router.route("/responses/analytics/:formId").get(verifyJWT, isTeacherOrAdmin, aggregateFormResponses);

export default router;