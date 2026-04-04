import { Router } from "express";
import { authMiddleware } from "../middleware/user.middleware.js";
import { generateInterViewReportController, getAllInterviewReportController, gernrateInterviewReportIdController } from "../controller/interview.controller.js";
import upload from "../middleware/files.middleware.js";

const interviewRoute = Router();

interviewRoute.post(
  "/interview",
  authMiddleware,
  upload.single("resume"),
  generateInterViewReportController,
);
interviewRoute.get("/interview/:id", authMiddleware, gernrateInterviewReportIdController);
interviewRoute.get("/interview", authMiddleware, getAllInterviewReportController);

export default interviewRoute;
