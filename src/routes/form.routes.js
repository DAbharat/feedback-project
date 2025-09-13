import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createForm, deleteForm, getAllForms, getFormById, toggleFormActive, updateForm } from "../controllers/form.controller.js";
import { getAllResponses, exportResponsesCSV } from "../controllers/formResponse.controller.js";
import { isStudent, isTeacherOrAdmin } from "../middlewares/role.middlewares.js";
import { Form } from "../models/form.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const router = Router();

router.get("/", verifyJWT, isTeacherOrAdmin, asyncHandler(async (req, res) => {
  const forms = await Form.find({});
  res.json({ success: true, data: forms });
}));
// Form management
router.route("/create-form").post(verifyJWT, isTeacherOrAdmin, createForm);
router.route("/forms").get(verifyJWT, getAllForms);
router.route("/:id").get(verifyJWT, getFormById);
router.route("/:id/update").patch(verifyJWT, isTeacherOrAdmin, updateForm);
router.route("/:id/delete").delete(verifyJWT, isTeacherOrAdmin, deleteForm);
router.route("/:id/active").put(verifyJWT, isTeacherOrAdmin, toggleFormActive);
// Form responses
router.route("/:id/responses").get(verifyJWT, isTeacherOrAdmin, getAllResponses);
router.route("/:id/responses/export").get(verifyJWT, isTeacherOrAdmin, exportResponsesCSV);

export default router;