import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        fullName: {
            type:String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        idCard: {
            type: String,
            required: true
        },
        profileImage: {
            type: String
        },
        role: {
            type: String,
            enum: ['student', 'teacher', 'admin'],
            default: 'student'
        },
        section: {
            type: String,
            required: function () {
                return this.role === 'student';
            }
        },
        course: {
            type: String,
            required: function () {
                return this.role === 'student';
            }
        },
        specialization: {
            type: String,
            required: function () {
                return this.role === 'student';
            }
        },
        year: {
            type: String,
            required: function () {
                return this.role === 'student';
            }
        },
        semester: {
            type: String,
            required: function () {
                return this.role === 'student';
            }
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}




userSchema.plugin(mongooseAggregatePaginate);
export const User = mongoose.model("User", userSchema)