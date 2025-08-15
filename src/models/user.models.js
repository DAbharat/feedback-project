import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
            enum: ['student','teacher', 'admin'],
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


userSchema.plugin(mongooseAggregatePaginate);
export const User = mongoose.model("User", userSchema)