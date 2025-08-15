import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


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



export {
    registerUser
}