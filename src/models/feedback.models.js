import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const feedbackSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        //required: true
    },
    course: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    collegeRollNo: {
        type: String,
        required: true
    },
    universityRollNo: {
        type: Number,
        required: true
    },
    teacherName: {
        type: String,
        //required: true
    },
    teacherSubject: {
        type: String,
        //required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "resolved"],
        default: "pending"
    }
},
    {
        timestamps: true
    }
);

feedbackSchema.plugin(mongooseAggregatePaginate);
export const Feedback = mongoose.model("Feedback", feedbackSchema);
