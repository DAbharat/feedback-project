import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found")
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Failed to generate tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    console.log("req.files:", req.files);
    console.log("req.body:", req.body);
    const username = req.body.username?.trim();
    const fullName = req.body.fullName?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    const role = req.body.role?.trim() || "student";
    const year = req.body.year?.trim();
    const specialization = req.body.specialization?.trim();
    const section = req.body.section?.trim();
    const course = req.body.course?.trim();
    const semester = req.body.semester?.trim();

    if ([username, fullName, email, password].some((field) => !field || field === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (role === "student" && ([section, course, semester, year, specialization].some(field => !field || field === ""))) {
        throw new ApiError(400, "Section, course, semester, year, and specialization are required for students");
    }

    const existedUser = await User.findOne({
        $or: [{ email }]
    });

    if (existedUser) {
        throw new ApiError(400, "User with same email already exists");
    }

    const idCardLocalPath = req.files?.idCard?.[0]?.path;

    if (!idCardLocalPath) {
        throw new ApiError(400, "ID card is required");
    }

    let idCard;
    try {
        idCard = await uploadOnCloudinary(idCardLocalPath);
        console.log("Uploaded ID Card", idCard);
    } catch (error) {
        console.log("Error uploading ID Card", error);
        throw new ApiError(500, "Failed to upload ID card");
    }

    const profileImageLocalPath = req.files?.profileImage?.[0]?.path;
    let profileImage;
    if (profileImageLocalPath) {
        profileImage = await uploadOnCloudinary(profileImageLocalPath);
    }

    try {
        const user = await User.create({
            username,
            fullName,
            email,
            password,
            idCard: idCard.url,
            profileImage: profileImage ? profileImage.url : undefined,
            role,
            year: role === "student" ? year : undefined,
            semester: role === "student" ? semester : undefined,
            course: role === "student" ? course : undefined,
            specialization: role === "student" ? specialization : undefined,
            section: role === "student" ? section : undefined
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        logger.info(`User registered: ${user.email}`);
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong");
        }

        return res
            .status(201)
            .json(new ApiResponse(200, createdUser, "User registered successfully"));
    } catch (error) {
        console.log("Error registering user: ", error);

        if (idCard) {
            await deleteFromCloudinary(idCard.public_id)
        }

        throw new ApiError(500, "Something went wrong while registering the user and images were deleted")
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({
        $or: [{ email }]
    });

    if (!user) {
        throw new ApiError(400, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    logger.info(`User logged in: ${user.email}`);
    if (!loggedInUser) {
        throw new ApiError(400, "Login is required")
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"));
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    logger.info(`User logged out: ${req.user.email}`);
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token")
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Access token refreshed successfully"
            ));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while refreshing the access token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    logger.info(`User password changed: ${req.user.email}`);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { email, username } = req.body;
    if (!(email || username)) {
        throw new ApiError(400, "Email or username is required");
    }

    if (email) {
        const existingEmail = await User.findOne({ email, _id: { $ne: req.user._id } });
        if (existingEmail) {
            throw new ApiError(400, "Email already in use");
        }
    }

    if (username) {
        const existingUsername = await User.findOne({ username, _id: { $ne: req.user._id } });
        if (existingUsername) {
            throw new ApiError(400, "Username already in use");
        }
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { email, username } },
        { new: true }
    ).select("-password -refreshToken");
    logger.info(`User account details updated: ${req.user.email}`);
    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserProfileImage = asyncHandler(async (req, res) => {
    const profileImageLocalPath = req.file?.path

    if (!profileImageLocalPath) {
        throw new ApiError(400, "Profile image is required");
    }

    const profileImage = await uploadOnCloudinary(profileImageLocalPath)

    if (!profileImage.url) {
        throw new ApiError(500, "Something went wrong while uploading the profile image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                profileImage: profileImage.url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")
    logger.info(`User profile image updated: ${req.user.email}`);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Profile image updated successfully"));
})

const getAllTeachers = asyncHandler(async (req, res) => {
    const teachers = await User.find({
        role: "teacher"
    }).select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200, teachers, "All teachers fetched successfully"));
});

const makeUserAdmin = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { role: "admin" } },
        { new: true }
    ).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User promoted to admin"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  let filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } }
    ];
  }
  const users = await User.find(filter).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, users, "All users fetched successfully"));
});

const demoteAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role !== "admin") throw new ApiError(400, "Only admins can be demoted");

  user.role = "teacher"; 
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, user, "Admin demoted to teacher"));
});

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    updateUserProfileImage,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getAllTeachers,
    makeUserAdmin,
    getAllUsers,
    demoteAdmin
}