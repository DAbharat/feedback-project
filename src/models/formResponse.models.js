import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const formResponseSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: [
        {
            questionText: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                min: 1,
                max: 5,
                required: true
            }
        }
    ],
    comment: {
        type: String
    }
},
    {
        timestamps: true
    }
);

formResponseSchema.index({ formId: 1, studentId: 1 }, { unique: true });
formResponseSchema.plugin(mongooseAggregatePaginate);
export const FormResponse = mongoose.model("FormResponse", formResponseSchema)