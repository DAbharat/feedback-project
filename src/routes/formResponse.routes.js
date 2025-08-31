import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { aggregateFormResponses, getFormResponseById, getResponsesForForm, submitFormResponse } from "../controllers/formResponse.controller.js";
import { isStudent, isTeacherOrAdmin } from "../middlewares/role.middlewares.js";


const router = Router();

router.route("/submitresponse").post(verifyJWT, isStudent, submitFormResponse);
router.route("/responses/:formId").get(verifyJWT, isStudent, getResponsesForForm);
router.route("/responses/:formId/:responseId").get(verifyJWT, isStudent, getFormResponseById);
router.route("/responses/analytics/:formId").get(verifyJWT, isTeacherOrAdmin, aggregateFormResponses);

export default router;