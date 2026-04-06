import { useEffect, useState } from "react";
import { getInterviewReportById, generateInterviewReportPDF } from "../services/api.interview.js";

export function generateInteriewreportPDF(interviewId) {