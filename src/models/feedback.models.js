import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    }, 
    course: {
        type: String,
        required: true
    }, 
    collegeRollNo: {
        type: String,
        required: true
    },
    universityRollNo: {
        type: String,
        required: true
    },

    
    identityCardUrl: {
        type: String,
        required: true
    },

    
    answers: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Question"
            },
            answer: mongoose.Schema.Types.Mixed // text, number, array, etc.
        }
    ],

    // Metadata for verification
    metadata: {
        verified: {
            type: Boolean,
            default: false
        }, // whether admin verified
        verificationNotes: {
            type: String
        } // optional remarks by admin
    },

    // Reference to the form this feedback belongs to
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
        required: true
    },
    
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

export const Feedback = mongoose.model("Feedback", feedbackSchema);
