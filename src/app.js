import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later"
});
app.use("/api", rateLimiter);

app.use(helmet());

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = process.env.NODE_ENV === "production"
    ? "Internal server error"
    : err.message || "Internal server error";
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

//importing routes
import healthcheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/user.routes.js";   
import feedbackRouter from "./routes/feedback.routes.js"
import formRouter from "./routes/form.routes.js"
import formResponseRouter from "./routes/formResponse.routes.js"
import notificationRouter from "./routes/notification.routes.js"






//creating routes
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/feedbacks", feedbackRouter)
app.use("/api/v1/forms", formRouter)
app.use("/api/v1/form-responses", formResponseRouter)
app.use("/api/v1/notifications", notificationRouter)





export { app }