import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Form } from "../models/form.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";


const createForm = asyncHandler(async (req, res) => {
    logger.info(`Creating form with data: ${JSON.stringify(req.body)}`);
    const { title, description, teacherId, questions, course, specialization, year, semester, deadline, isActive } = req.body;
    if (!title || !teacherId || !questions || questions.length === 0) {
        throw new ApiError(400, "Title, teacher, and questions are required");
    }
    const form = await Form.create({
        title,
        description,
        teacherId,
        questions,
        course,
        specialization,
        year,
        semester,
        deadline,
        isActive: isActive ?? false,
        createdBy: (teacherId || adminId)
    });
    logger.info(`Form created: ${form.id}`);
    res.status(201).json(new ApiResponse(201, form, "Form created successfully"));
});

const getAllForms = asyncHandler(async (req, res) => {
    console.log(req.user.course, req.user.specialization, req.user.semester, req.user.year);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.user.role === "student") {
        filter.isActive = true;
        filter.course = req.user.course;
        if (req.user.specialization) {
            filter.$or = [
                { specialization: req.user.specialization },
                { specialization: { $in: [null, '', 'ALL'] } }
            ];
        }
        filter.semester = req.user.semester;
        filter.year = req.user.year;
    }

    const forms = await Form.find(filter).skip(skip).limit(limit);
    console.log('Forms found:', forms);
    const total = await Form.countDocuments(filter);

    res.json({
        success: true,
        data: forms,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    });
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
    logger.info(`Updating form ${id} with data: ${JSON.stringify(updates)}`);
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
        logger.info(`Form deleted: ${form.id}`);
        if (!form) throw new ApiError(404, "Form not found");
        res.json(new ApiResponse(200, {}, "Form deleted"));
    } else {
        throw new ApiError(403, "Teacher or admin access required");
    }
});

const toggleFormActive = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    if (req.user?.role === "teacher" || req.user?.role === "admin") {
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
