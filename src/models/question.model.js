import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    text: String,
    type: {
        type: String,
        enum: ["text", "number", "select", "radio", "checkbox"]
    },
    options: [String] // only for select/radio/checkbox
});

export const Question = mongoose.model("Question", questionSchema);