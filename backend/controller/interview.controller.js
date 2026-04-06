import { PDFParse } from "pdf-parse";
import {
  generateInterviewReport,
  generateInterviewReportPDF,
} from "../services/ai.services.js";
import interViewReportModel from "../model/interview.model.js";

async function generateInterViewReportController(req, res) {
  try {
    const resumeContent = await new PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();
    const { selfDescription, jobDescription } = req.body;

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interViewReportModel.create({
      user: req.user.id,
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    });

    res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("Error generating interview report:", error);
    res.status(500).json({
      message: "An error occurred while generating the interview report.",
      error: error.message,
    });
  }
}

async function gernrateInterviewReportIdController(req, res) {
  try {
    const { id } = req.params;
    const interViewReport = await interViewReportModel.findOne({
      _id: id,
      user: req.user.id,
    });
    if (!interViewReport) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }
    res.status(200).json({
      message: "Interview report fetched successfully",
      interViewReport,
    });
  } catch (error) {
    res.status(500).json({
      message: "oops",
      error: error.message,
    });
  }
}

async function getAllInterviewReportController(req, res) {
  try {
    const interviewReports = await interViewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
      );
    res.status(200).json({
      message: "Interview reports fetched successfully",
      interviewReports,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching interview reports",
      error: error.message,
    });
  }
}

async function generateInterviewReportPDFController(req, res) {
  try {
    const { id } = req.params;
    const interviewReport = await interViewReportModel.findById(id);

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    const { resume, selfDescription, jobDescription } = interviewReport;

    const pdfBuffer = await generateInterviewReportPDF({
      resume,
      selfDescription,
      jobDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${id}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating interview report PDF:", error);
    res.status(500).json({
      message: "An error occurred while generating the interview report PDF.",
      error: error.message,
    });
  }
}

export {
  generateInterViewReportController,
  gernrateInterviewReportIdController,
  getAllInterviewReportController,
  generateInterviewReportPDFController,
};
