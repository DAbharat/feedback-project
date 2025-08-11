import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Question" }]
});

export const Form = mongoose.model("Form", formSchema);