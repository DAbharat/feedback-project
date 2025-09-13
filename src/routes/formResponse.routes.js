import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { aggregateFormResponses, getFormResponseById, getResponsesForForm, submitFormResponse, getAllResponses } from "../controllers/formResponse.controller.js";
import { isStudent, isTeacherOrAdmin } from "../middlewares/role.middlewares.js";


const router = Router();

router.route("/submitresponse").post(verifyJWT, isStudent, submitFormResponse);
router.route("/responses").get(verifyJWT, isTeacherOrAdmin, getResponsesForForm);
router.route("/responses/all").get(verifyJWT, isTeacherOrAdmin, getAllResponses);
router.route("/responses/analytics/:formId").get(verifyJWT, isTeacherOrAdmin, aggregateFormResponses);
router.route("/responses/:formId/:responseId").get(verifyJWT, isTeacherOrAdmin, getFormResponseById);

export default router;