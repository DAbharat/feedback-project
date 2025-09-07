import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import logger from "./utils/logger.js";


const app = express();
logger.info("App started");

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
    limit: "1064kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())

const morganFormat = ":method :url :status :response-time ms";

app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(' ')[0],
        url: message.split(' ')[1],
        status: message.split(' ')[2],
        responseTime: message.split(' ')[3]
      };
      logger.info(JSON.stringify(logObject));
    }
  }
}))

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