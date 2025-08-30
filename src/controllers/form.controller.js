import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Form } from "../models/form.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createForm = asyncHandler(async (req, res) => {
    const { title, description, teacherId, questions, targetCourse, targetYear, deadline, isActive } = req.body;
    if (!title || !teacherId || !questions || questions.length === 0) {
        throw new ApiError(400, "Title, teacher, and questions are required");
    }
    const form = await Form.create({
        title,
        description,
        teacherId,
        questions,
        targetCourse,
        targetYear,
        deadline,
        isActive: isActive ?? false,
        createdBy: (teacherId || adminId)
    });
    res.status(201).json(new ApiResponse(201, form, "Form created successfully"));
});

const getAllForms = asyncHandler(async (req, res) => {
    const forms = await Form.find();
    res.json(new ApiResponse(200, forms, "All forms"));
});

const getFormById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const form = await Form.findById(id);
    if (!form) throw new ApiError(404, "Form not found");
    res.json(new ApiResponse(200, form, "Form details"));
});

const updateForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    if (req.user?.role === "teacher" || req.user?.role === "admin") {
        const form = await Form.findByIdAndUpdate(id, updates, { new: true });
        if (!form) throw new ApiError(404, "Form not found");
        res.json(new ApiResponse(200, form, "Form updated"));
    } else {
        throw new ApiError(403, "Teacher or admin access required");
    }
});

const deleteForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (req.user?.role === "teacher" || req.user?.role === "admin") {
        const form = await Form.findByIdAndDelete(id);
        if (!form) throw new ApiError(404, "Form not found");
        res.json(new ApiResponse(200, {}, "Form deleted"));
    } else {
        throw new ApiError(403, "Teacher or admin access required");
    }
});

const toggleFormActive = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    if(req.user?.role === "teacher" || req.user?.role === "admin") {
        const form = await Form.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!form) throw new ApiError(404, "Form not found");
        res.json(new ApiResponse(200, form, `Form ${isActive ? "activated" : "deactivated"}`));
    } else {
        throw new ApiError(403, "Teacher or admin access required");
    }
});


export {
    createForm,
    getAllForms,
    getFormById,
    updateForm,
    deleteForm,
    toggleFormActive
}
