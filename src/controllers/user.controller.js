import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
    
        if(!user) {
            throw new ApiError(404, "User not found")
        }
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Failed to generate tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // Trim all string fields and set default role
    const username = req.body.username?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    const role = req.body.role?.trim() || "student";
    const section = req.body.section?.trim();
    const course = req.body.course?.trim();
    const semester = req.body.semester?.trim();

    if ([username, email, password].some((field) => !field || field === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (role === "student" && ([section, course, semester].some(field => !field || field === ""))) {
        throw new ApiError(400, "Section, course, and semester are required for students");
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

    try {
        const user = await User.create({
            username,
            email,
            password,
            idCard: idCard.url,
            role,
            semester: role === "student" ? semester : undefined,
            course: role === "student" ? course : undefined,
            section: role === "student" ? section : undefined
        });
    
        const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong");
        }
    
        return res
            .status(201)
            .json(new ApiResponse(200, createdUser, "User registered successfully"));
    } catch (error) {
        console.log("Error registering user: ", error);

        if(idCard) {
            await deleteFromCloudinary(idCard.public_id)
        }
        
        throw new ApiError(500, "Something went wrong while registering the user and images were deleted")
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body

    if(!email) {
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({
        $or: [{ email }]
    });

    if(!user) {
        throw new ApiError(400, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(400, "Invalid password")
    }

    const { accessToken, refreshToken } = await  generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    if(!loggedInUser) {
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

const logoutUser = asyncHandler(async(req,res) => {
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

const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)

        if(!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if(incomingRefreshToken !==  user?.refreshToken) {
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


export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
}