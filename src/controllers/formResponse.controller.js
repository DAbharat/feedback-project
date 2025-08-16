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
	res.status(201).json(new ApiResponse(201, response, "Form response submitted"));
});

const getResponsesForForm = asyncHandler(async (req, res) => {
	const { formId } = req.params;
	const responses = await FormResponse.find({ formId });
	res.json(new ApiResponse(200, responses, "Responses for form"));
});

const getFormResponseById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const response = await FormResponse.findById(id);
	if (!response) throw new ApiError(404, "Form response not found");
	res.json(new ApiResponse(200, response, "Form response details"));
});

const aggregateFormResponses = asyncHandler(async (req, res) => {
	const { formId } = req.params;
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
		{ $sort: { avgRating: -1 } }
	];
	const analytics = await FormResponse.aggregate(pipeline);
	res.json(new ApiResponse(200, analytics, "Form response analytics"));
});


export {
	submitFormResponse,
	getResponsesForForm,
	getFormResponseById,
	aggregateFormResponses
}
