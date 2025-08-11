import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['student', 'admin'],
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
        semester: {
            type: Number,
            required: function () {
                return this.role === 'student';
            }
        }
    }, 
    { 
        timestamps: true 
    }
);



export const User = mongoose.model("User", userSchema)