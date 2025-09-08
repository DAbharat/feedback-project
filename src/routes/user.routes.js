import { Router } from "express";
import { body, validationResult } from "express-validator";
import { registerUser, loginUser, logoutUser, updateUserProfileImage, changeCurrentPassword, getCurrentUser, updateAccountDetails, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { isAdmin } from "../middlewares/role.middlewares.js";
import { makeUserAdmin, getAllTeachers } from "../controllers/user.controller.js";


const router = Router();

const validate = (validations) => [
    ...validations,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

router.route("/register").post(
    (req, res, next) => {
        upload.fields([
            { name: "idCard", maxCount: 1 },
            { name: "profileImage", maxCount: 1 }
        ])(req, res, function (err) {
            if (err) {
                console.log("Multer error:", err);
                return res.status(400).json({ error: err.message });
            }
            console.log("req.body:", req.body);
            console.log("req.files:", req.files);
            next();
        });
    },
    validate([
        body("email").isEmail().withMessage("Valid email is required"),
        body("password")
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
            .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
            .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
            .matches(/[0-9]/).withMessage("Password must contain a digit")
            .matches(/[^A-Za-z0-9]/).withMessage("Password must contain a special character"),
        body("username").notEmpty().withMessage("Username is required"),
        body("fullName").notEmpty().withMessage("Full name is required"),
        body("role").optional().isIn(["student", "teacher", "admin"]).withMessage("Role must be student, teacher, or admin")
    ]),

    registerUser
);

router.route("/login").post(
    validate([
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required")
    ]),
    loginUser
);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(
    verifyJWT,
    validate([
        body("oldPassword").isLength({ min: 8 }).withMessage("Old password must be at least 8 characters"),
        body("newPassword").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
            .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
            .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
            .matches(/[0-9]/).withMessage("Password must contain a digit")
            .matches(/[^A-Za-z0-9]/).withMessage("Password must contain a special character")
    ]),
    changeCurrentPassword
);

router.route("/update-profile-image").patch(verifyJWT, upload.single("profileImage"), updateUserProfileImage);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-details").patch(
    verifyJWT,
    validate([
        body("email").optional().isEmail().withMessage("Valid email is required"),
        body("username").optional().notEmpty().withMessage("Username cannot be empty")
    ]),
    updateAccountDetails
);

router.route("/teachers").get(verifyJWT, isAdmin, getAllTeachers);

router.route("/make-admin/:userId").post(verifyJWT, isAdmin, makeUserAdmin);

router.route("/logout").post(verifyJWT, logoutUser);

export default router;