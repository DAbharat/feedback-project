import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { isTeacher, isAdmin } from "../middlewares/role.middlewares.js";


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

    const pipeline = [
        {
            $match: filters
        },
        // Optionally join with User collection for student details
        {
            $lookup: {
                from: "users",
                localField: "studentId",
                foreignField: "_id",
                as: "student"
            }
        },
        { 
            $unwind: "$student" 
        },
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
})

const getFeedbackStats = asyncHandler(async (req, res) => {
  const pipeline = [
    { 
        $group: { 
            _id: "$teacherName", 
            count: { 
                $sum: 1 
            } 
        } 
    },
    { $sort: { count: -1 } }
  ];
  const stats = await Feedback.aggregate(pipeline);
  res.json(new ApiResponse(200, stats, "Feedback count per teacher"));
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



export {
    getFilteredFeedbacks,
    getFeedbackStats,
    getFeedbackTrends,
    getTopKeywords,
    getFeedbackByStatus
}