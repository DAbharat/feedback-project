import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["feedbackSubmitted", "feedbackChecked", "formPublished"],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "relatedModel"               
  },
  relatedModel: {
    type: String,
    enum: ["Feedback", "Form"]
  },
  sent: {
    type: Boolean,
    default: false
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Notification = mongoose.model("Notification", notificationSchema)