import { Router } from "express";
import { registerUser, loginUser, logoutUser, updateUserProfileImage, changeCurrentPassword, getCurrentUser, updateAccountDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "idCard",
            maxCount: 1
        },
        {
            name: "profileImage",
            maxCount: 1
        }
    ]), registerUser
)

router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-profile-image").patch(verifyJWT, upload.single("profileImage"), updateUserProfileImage)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-details").patch(verifyJWT, updateAccountDetails)
router.route("/logout").post(verifyJWT, logoutUser)

export default router