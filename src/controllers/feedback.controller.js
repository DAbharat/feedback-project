import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { Feedback } from "../models/feedback.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { isTeacher, isAdmin } from "../middlewares/role.middlewares.js";

const submitGeneralFeedback = asyncHandler(async (req, res) => {
    const user = req.user;
    const {
        message,
        rollNo,
        universityRollNo,
        teacherId,
        teacherName,
        teacherSubject
    } = req.body;

    if (!user || !user._id || !user.fullName || !user.course || !user.year || !user.semester || !rollNo || !universityRollNo || !message) {
        throw new ApiError(400, "All fields are required");
    }

    if (teacherId && (!teacherName || !teacherSubject)) {
        throw new ApiError(400, "Teacher name and subject are required if teacher is selected");
    }

    const feedbackData = {
        studentId: user._id,
        course: user.course,
        year: user.year,
        semester: user.semester,
        collegeRollNo: rollNo,
        universityRollNo,
        message,
        status: "pending"
    };
    if (teacherId) {
        feedbackData.teacherId = teacherId;
        feedbackData.teacherName = teacherName;
        feedbackData.teacherSubject = teacherSubject;
    }

    const feedback = await Feedback.create(feedbackData);
    res.status(201).json(new ApiResponse(201, feedback, "Feedback submitted successfully"));
});

const getFilteredFeedbacks = asyncHandler(async (req, res) => {
    
        const filters = {};
        if (req.query.teacherName) filters.teacherName = req.query.teacherName;
        if (req.query.course) filters.course = req.query.course;
        if (req.query.semester) filters.semester = req.query.semester;
        if (req.query.section) filters.section = req.query.section;
        if (req.query.status) filters.status = req.query.status;
        if (req.query.category) filters.category = req.query.category;
        if (req.query.startDate && req.query.endDate) {
            filters.createdAt = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        // Pagination defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;

        const pipeline = [
            {
                $match: filters
            },
            {
                $lookup: {
                    from: "users",
                    localField: "studentId",
                    foreignField: "_id",
                    as: "student"
                }
            },
            { $unwind: "$student" },
            {
                $project: {
                    teacherName: 1,
                    course: 1,
                    semester: 1,
                    section: 1,
                    message: 1,
                    createdAt: 1,
                    student: {
                        username: 1,
                        fullName: 1,
                        email: 1
                    }
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
    ];

    const feedbacks = await Feedback.aggregate(pipeline);
    res.status(200).json(new ApiResponse(200, feedbacks, "Filtered feedbacks"));
});


const getFeedbackTrends = asyncHandler(async (req, res) => {
  const pipeline = [
    {
      $group: {
        _id: { 
            $dateToString: {
                format: "%d-%m-%Y", 
                date: "$createdAt" 
            } 
        },
        count: { 
            $sum: 1 
        }
      }
    },
    { 
        $sort: { 
            "_id": 1 
        } 
    }
  ];
  const trends = await Feedback.aggregate(pipeline);
  res.json(new ApiResponse(200, trends, "Feedback trends by day"));
});

const getTopKeywords = asyncHandler(async (req, res) => {
  const pipeline = [
    { 
        $unwind: "$keywords" 
    },
    { 
        $group: { 
            _id: "$keywords", 
            count: { 
                $sum: 1 
            } 
        } 
    },
    { 
        $sort: { 
            count: -1 
        } 
    },
    { 
        $limit: 10 
    }
  ];
  const keywords = await Feedback.aggregate(pipeline);
  res.json(new ApiResponse(200, keywords, "Top feedback keywords"));
});

const getFeedbackByStatus = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const pipeline = [
    { 
        $match: { 
            status 
        } 
    },
    { 
        $sort: { 
            createdAt: -1 
        } 
    }
  ];
  const feedbacks = await feedbacks.aggregate(pipeline);
  res.json(new ApiResponse(200, feedbacks, `Feedbacks with status: ${status}`));
});

const getAllTeachers = asyncHandler(async (req, res) => {
    const teachers = await User.find({ role: "teacher" }, { _id: 1, fullName: 1, subjects: 1 });
    res.status(200).json(new ApiResponse(200, teachers, "All teachers"));
});

export {
    getFilteredFeedbacks,
    //getFeedbackStats,
    getFeedbackTrends,
    getTopKeywords,
    getFeedbackByStatus,
    getAllTeachers,
    submitGeneralFeedback
};



