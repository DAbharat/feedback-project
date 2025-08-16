import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { aggregateFormResponses, getFormResponseById, getResponsesForForm, submitFormResponse } from "../controllers/formResponse.controller.js";


const router = Router();


router.route("/submitresponse").post(verifyJWT, submitFormResponse);
router.route("/responses/:formId").get(verifyJWT, getResponsesForForm);
router.route("/responses/:formId/:responseId").get(verifyJWT, getFormResponseById);
router.route("/responses/analytics/:formId").get(verifyJWT, aggregateFormResponses);

export default router;