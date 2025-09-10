import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  } ,
  questions: [
    {
      text: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ["rating"],
        default: "rating"
      },
      scale: {
        type: Number,
        default: 5
      }
    }
  ],

  course: String, 
  specialization: String,
  semester: String,
  year: String,   
  deadline: Date, 

  isActive: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},
  {
    timestamps: true
  });

export const Form = mongoose.model("Form", formSchema)