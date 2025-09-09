import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { FormResponse } from "../models/formResponse.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const submitFormResponse = asyncHandler(async (req, res) => {
	const { formId, studentId, rating, comment } = req.body;
	if (!formId || !studentId || !rating) {
		throw new ApiError(400, "Form, student, and rating are required");
	}

	const exists = await FormResponse.findOne({ formId, studentId });
	if (exists) throw new ApiError(400, "You have already submitted a response for this form");
	const response = await FormResponse.create({ formId, studentId, rating, comment });
	logger.info(`Form response submitted for form ${formId} by student ${studentId}`);
	res.status(201).json(new ApiResponse(201, response, "Form response submitted"));
});

const getResponsesForForm = asyncHandler(async (req, res) => {
	const { formId } = req.params;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	const responses = await FormResponse.find({ formId }).skip(skip).limit(limit);
	const total = await FormResponse.countDocuments({ formId });
	res.json({
		success: true,
		data: responses,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
		totalItems: total,
		message: "Responses for form"
	});
});

const getFormResponseById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const response = await FormResponse.findById(id);
	logger.info(`Fetched form response ${id}`);
	if (!response) throw new ApiError(404, "Form response not found");
	res.json(new ApiResponse(200, response, "Form response details"));
});

const aggregateFormResponses = asyncHandler(async (req, res) => {
	const { formId } = req.params;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	const pipeline = [
		{ $match: { formId } },
		{ $unwind: "$rating" },
		{
			$group: {
				_id: "$rating.questionText",
				avgRating: { $avg: "$rating.rating" },
				count: { $sum: 1 }
			}
		},
		{ $sort: { avgRating: -1 } },
		{ $skip: skip },
		{ $limit: limit }
	];
	const analytics = await FormResponse.aggregate(pipeline);
	res.json(new ApiResponse(200, analytics, "Form response analytics"));
});

const getAllResponses = asyncHandler(async (req, res) => {
	const { formId, studentId, page = 1, limit = 20 } = req.query;
	const filter = {};
	if (formId) filter.formId = formId;
	if (studentId) filter.studentId = studentId;

	const skip = (parseInt(page) - 1) * parseInt(limit);
	const responses = await FormResponse.find(filter)
		.populate("formId", "title")
		.populate("studentId", "fullName email username")
		.skip(skip)
		.limit(parseInt(limit));
	const total = await FormResponse.countDocuments(filter);

	res.json({
		success: true,
		data: responses,
		page: parseInt(page),
		limit: parseInt(limit),
		totalPages: Math.ceil(total / limit),
		totalItems: total
	});
});

const exportResponsesCSV = asyncHandler(async (req, res) => {
	const { formId } = req.query;
	const filter = {};
	if (formId) filter.formId = formId;
	const responses = await FormResponse.find(filter)
		.populate("formId", "title")
		.populate("studentId", "fullName email username");

	let csv = "Form Title,Student Name,Student Email,Question,Rating,Comment\n";
	responses.forEach(resp => {
		resp.rating.forEach(q => {
			csv += `"${resp.formId.title}","${resp.studentId.fullName}","${resp.studentId.email}","${q.questionText}",${q.rating},"${resp.comment || ''}"\n`;
		});
	});
	res.header("Content-Type", "text/csv");
	res.attachment("responses.csv");
	return res.send(csv);
});

export {
	submitFormResponse,
	getResponsesForForm,
	getFormResponseById,
	aggregateFormResponses,
	getAllResponses,
	exportResponsesCSV
};
