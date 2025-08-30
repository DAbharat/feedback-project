import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createForm, deleteForm, getAllForms, getFormById, toggleFormActive, updateForm } from "../controllers/form.controller.js";
import { isAdmin, isTeacher } from "../middlewares/role.middlewares.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();

const isTeacherOrAdmin = (req, res, next) => {
	if (req.user?.role === "teacher" || req.user?.role === "admin") {
		return next();
	}
    else {
        throw new ApiError(403, "Teacher or admin access required");
    }
};

router.route("/create-form").post(verifyJWT, isTeacherOrAdmin, createForm);
router.route("/forms").get(verifyJWT,isTeacherOrAdmin, getAllForms);
router.route("/forms/:id").get(verifyJWT,isTeacherOrAdmin, getFormById);
router.route("/forms/:id/update").patch(verifyJWT,isTeacherOrAdmin, updateForm);
router.route("/forms/:id/delete").delete(verifyJWT,isTeacherOrAdmin, deleteForm);
router.route("/forms/:id/active").put(verifyJWT,isTeacherOrAdmin, toggleFormActive);

export default router;