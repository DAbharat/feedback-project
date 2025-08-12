import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  teacherName: {
    type: String,
    required: true
  },
  teacherSubject: {
    type: String,
    required: true
  },
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

  targetCourse: String, 
  targetYear: Number,   
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