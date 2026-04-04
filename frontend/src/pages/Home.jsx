import { generateInterviewReport, getAllInterviewReports, getInterviewReportById } from '../services/api.interview.js';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';

export default function Home() {
  const [formData, setFormData] = useState({
    selfDescription: "",
    jobDescription: ""
  });
  const resumeInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interviewReport, setInterviewReport] = useState(null);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }
  const handleReportGeneration = async () => {
    setError(null);

    const resumeFile = resumeInputRef.current.files[0];
    if (!resumeFile) {
      setError("Please upload your resume in PDF format.");
      return;
    }
    if(!formData.selfDescription.trim() || !formData.jobDescription.trim()) {
      setError("Please fill in both the self description and job description.");
      return;
    }
    try{
      setLoading(true);
      const response = await generateInterviewReport({ ...formData, resume: resumeFile });
      setInterviewReport(response.data.interviewReport);
      navigate(`/interview/${response.data.interviewReport._id}`);

    } catch (err) {
      setError("Failed to generate interview report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && (
        <div className="w-full max-w-3xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">Error: </strong> {error}
        </div>
      )}
      <main className="home-page min-h-screen bg-slate-50 flex justify-center items-start py-12">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-xl p-8 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">
            Interview Report Generator
          </h1>
          <p className="text-sm text-slate-500">
            Upload your resume, tell us about yourself and the job, and we'll generate an interview prep report.
          </p>
        </header>

        <section className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="selfDescription"
              className="block text-sm font-medium text-slate-700"
            >
              About You
            </label>
            <textarea
              id="selfDescription"
              name="selfDescription"
              placeholder="Tell us about your background, skills, and what you're looking for..."
              className="w-full min-h-[120px] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
              value={formData.selfDescription}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="jobDescription"
              className="block text-sm font-medium text-slate-700"
            >
              Job Description
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              placeholder="Paste the job description or key responsibilities here..."
              className="w-full min-h-[120px] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
              value={formData.jobDescription}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-slate-700"
            >
              Resume (PDF)
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf"
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              ref={resumeInputRef}
            />
            <p className="text-xs text-slate-400">
              Maximum size 5MB. PDF format only.
            </p>
          </div>
        </section>

        <footer className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
            disabled={loading}
            onClick={handleReportGeneration}
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </footer>
      </div>
    </main>
    </>
  );
}