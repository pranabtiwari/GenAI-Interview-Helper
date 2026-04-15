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
    <main className="home-page w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 font-sans flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_18px_60px_rgba(15,23,42,0.75)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_40%),_radial-gradient(circle_at_bottom,_#22c55e_0,_transparent_45%)]" />

        <div className="relative grid gap-8 p-8 md:grid-cols-[1.3fr_1fr] md:p-10">
          <section className="space-y-6">
            {error && (
              <div
                className="w-full rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
                role="alert"
              >
                <strong className="font-semibold">Error: </strong> {error}
              </div>
            )}

            <header className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI Interview Copilot
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
                Turn your resume into a tailored interview plan.
              </h1>
              <p className="text-sm leading-relaxed text-slate-300">
                Drop your resume, describe yourself and the role, and we’ll craft
                focused questions and a preparation roadmap so you walk into the
                interview ready.
              </p>
            </header>

            <div className="space-y-4 rounded-2xl bg-slate-900/50 p-4 border border-slate-700/60">
              <div className="space-y-1">
                <label
                  htmlFor="selfDescription"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400"
                >
                  About you
                </label>
                <textarea
                  id="selfDescription"
                  name="selfDescription"
                  placeholder="Share your background, experience level, and what you're aiming for."
                  className="w-full min-h-[96px] rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  value={formData.selfDescription}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="jobDescription"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400"
                >
                  Job description
                </label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  placeholder="Paste the job description or key responsibilities."
                  className="w-full min-h-[96px] rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </section>

          <aside className="space-y-6 rounded-2xl bg-slate-950/70 p-4 border border-slate-800/80">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Resume upload
              </p>
              <label
                htmlFor="resume"
                className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-4 py-6 text-center hover:border-indigo-400/70 hover:bg-slate-900/90 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 group-hover:bg-indigo-500/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 5v14" />
                    <path d="m5 12 7-7 7 7" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-100">
                    Drop your resume (PDF)
                  </p>
                  <p className="text-[0.7rem] text-slate-400">
                    Max 5MB. We only use it to craft your interview prep.
                  </p>
                </div>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf"
                  className="hidden"
                  ref={resumeInputRef}
                />
              </label>
            </div>

            <div className="space-y-3 text-xs text-slate-400">
              <p className="font-semibold tracking-[0.14em] uppercase text-slate-500">
                What you'll get
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Role-specific technical and behavioral questions
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  A day‑by‑day preparation roadmap
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  Highlighted skill gaps to focus on
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/40 hover:from-indigo-400 hover:via-sky-400 hover:to-emerald-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={handleReportGeneration}
              >
                {loading ? "Generating your plan..." : "Generate interview plan"}
              </button>
              <button
                type="button"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-slate-900/80"
                onClick={() => navigate('/results')}
              >
                View all previous reports
              </button>
              <p className="mt-2 text-[0.7rem] text-slate-500 text-center">
                We don’t store your resume after generating the report.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}