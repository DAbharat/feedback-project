import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createForm, deleteForm, getAllForms, getFormById, toggleFormActive, updateForm } from "../controllers/form.controller.js";

const router = Router();

router.route("/create-form").post(verifyJWT, createForm);
router.route("/forms").get(verifyJWT, getAllForms);
router.route("/forms/:id").get(verifyJWT, getFormById);
router.route("/forms/:id/update").patch(verifyJWT, updateForm);
router.route("/forms/:id/delete").delete(verifyJWT, deleteForm);
router.route("/forms/:id/active").put(verifyJWT, toggleFormActive);

export default router;