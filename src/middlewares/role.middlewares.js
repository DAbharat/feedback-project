import { ApiError } from "../utils/ApiError.js";

const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return next(new ApiError(403, "Admin access required"));
    }
    next();
};

const isTeacher = (req, res, next) => {
    if (req.user?.role !== "teacher") {
        return next(new ApiError(403, "Teacher access required"));
    }
    next();
};

const isStudent = (req, res, next) => {
    if (req.user?.role !== "student") {
        return next(new ApiError(403, "Student access required"));
    }
    next();
};

export {
    isAdmin,
    isTeacher,
    isStudent
}