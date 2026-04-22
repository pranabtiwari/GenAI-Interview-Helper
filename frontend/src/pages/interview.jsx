import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import {
  getInterviewReportById,
  generateInterviewReportPDF,
} from "../services/api.interview.js";

const severityClass = (severity) => {
  const value = (severity || "").toString().toLowerCase();
  if (value === "high") {
    return "text-[#ff4d4d] bg-[#ff4d4d1a] border-[#ff4d4d40]";
  }
  if (value === "medium") {
    return "text-[#f5a623] bg-[#f5a6231a] border-[#f5a62340]";
  }
  return "text-[#3fb950] bg-[#3fb9501a] border-[#3fb95040]";
};

const scoreRingClass = (score) => {
  if (score >= 80) return "border-[#3fb950]";
  if (score >= 60) return "border-[#f5a623]";
  return "border-[#ff4d4d]";
};

const Interview = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("technical");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getInterviewReportById(interviewId);
        // backend returns { message, interViewReport }
        setReport(response.data.interViewReport);
      } catch (err) {
        console.error(err);
        setError("Failed to load interview report.");
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      loadReport();
    }
  }, [interviewId]);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const response = await generateInterviewReportPDF(interviewId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Option A: force download
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume_${interviewId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Option B: open in new tab instead of download:
      // window.open(url, "_blank");

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex items-center justify-center">
        <h1 className="text-base font-medium text-slate-200">
          Loading your interview plan...
        </h1>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex items-center justify-center">
        <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-100">
          {error || "No interview report found."}
        </p>
      </main>
    );
  }

  const technicalQuestions = report.techniQuestion || [];
  const behavioralQuestions = report.behavQuestion || [];
  const preparationPlan = report.preparationPlan || [];
  const skillGaps = report.skillGaps || [];
  const ringClass = scoreRingClass(report.matchScore || 0);

  return (
    <main className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 font-sans flex items-center justify-center px-3 py-3 sm:px-4 sm:py-4">
      <div className="relative flex w-full max-w-7xl min-h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-[0_18px_60px_rgba(15,23,42,0.75)] backdrop-blur-xl md:h-[calc(100vh-2rem)] md:flex-row">
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_top,#4f46e5_0,transparent_45%),radial-gradient(circle_at_bottom,#22c55e_0,transparent_45%)]" />

        {/* Left nav */}
        <nav className="relative flex w-full shrink-0 flex-col justify-between gap-4 border-b border-slate-800/70 bg-slate-950/60 p-4 md:w-56 md:border-b-0 md:border-r md:p-7">
          <div>
            <p className="mb-3 px-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500 md:px-3">
              Sections
            </p>

            <div className="grid grid-cols-3 gap-1.5 md:flex md:flex-col md:gap-1.5">
              <button
                type="button"
                onClick={() => setActiveSection("technical")}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-2 text-center text-[0.62rem] font-medium leading-tight transition-colors sm:flex-row sm:justify-start sm:gap-2.5 sm:px-3 sm:py-2.5 sm:text-sm sm:text-left md:justify-start ${
                  activeSection === "technical"
                    ? "border-slate-700/80 bg-slate-900/70 text-slate-50"
                    : "border-transparent text-slate-400 hover:border-slate-700/80 hover:bg-slate-900/70 hover:text-slate-50"
                }`}
              >
                <span className="flex items-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </span>
                <span className="sm:hidden">Tech</span>
                <span className="hidden sm:inline">Technical questions</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("behavioral")}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-2 text-center text-[0.62rem] font-medium leading-tight transition-colors sm:flex-row sm:justify-start sm:gap-2.5 sm:px-3 sm:py-2.5 sm:text-sm sm:text-left md:justify-start ${
                  activeSection === "behavioral"
                    ? "border-slate-700/80 bg-slate-900/70 text-slate-50"
                    : "border-transparent text-slate-400 hover:border-slate-700/80 hover:bg-slate-900/70 hover:text-slate-50"
                }`}
              >
                <span className="flex items-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <span className="sm:hidden">Behavior</span>
                <span className="hidden sm:inline">Behavioral questions</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("roadmap")}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-2 text-center text-[0.62rem] font-medium leading-tight transition-colors sm:flex-row sm:justify-start sm:gap-2.5 sm:px-3 sm:py-2.5 sm:text-sm sm:text-left md:justify-start ${
                  activeSection === "roadmap"
                    ? "border-slate-700/80 bg-slate-900/70 text-slate-50"
                    : "border-transparent text-slate-400 hover:border-slate-700/80 hover:bg-slate-900/70 hover:text-slate-50"
                }`}
              >
                <span className="flex items-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                </span>
                <span className="sm:hidden">Roadmap</span>
                <span className="hidden sm:inline">Road map</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-indigo-500 via-sky-500 to-emerald-400 px-3 py-2 text-[0.7rem] font-semibold text-white shadow-lg shadow-indigo-500/40 transition-colors hover:from-indigo-400 hover:via-sky-400 hover:to-emerald-300"
            disabled={downloading}
          >
            {downloading ? "Preparing PDF..." : "Download PDF"}
          </button>
        </nav>

        {/* Center content */}
        <section className="relative flex-1 overflow-y-auto border-b border-r-0 border-slate-800/70 bg-slate-950/50 px-4 py-5 md:border-r md:px-8 md:py-7">
          {activeSection === "technical" && (
            <div className="pr-1">
              <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-slate-800/70">
                <h2 className="text-[1.05rem] font-semibold text-slate-50">
                  Technical questions
                </h2>
                <span className="text-xs text-slate-300 bg-slate-900/70 px-2 py-0.5 rounded-2xl border border-slate-700/80">
                  {technicalQuestions.length} questions
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {technicalQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden"
                  >
                    <div className="flex items-start gap-3 px-4 py-3">
                      <span className="text-[0.7rem] font-semibold text-emerald-300 bg-emerald-400/10 border border-emerald-400/40 rounded-full px-2 py-0.5 mt-0.5">
                        Q{i + 1}
                      </span>
                      <p className="flex-1 text-sm font-medium text-slate-50 leading-relaxed">
                        {q.question}
                      </p>
                    </div>
                    <div className="px-4 pb-3 pt-2 border-t border-slate-800/80 space-y-3">
                      <div className="space-y-1">
                        <span className="inline-flex text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-indigo-300 bg-indigo-500/10 border border-indigo-400/40 rounded px-2 py-0.5">
                          Intention
                        </span>
                        <p className="text-[0.84rem] text-slate-300 leading-relaxed">
                          {q.intention}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="inline-flex text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-300 bg-emerald-400/10 border border-emerald-400/40 rounded px-2 py-0.5">
                          Model Answer
                        </span>
                        <p className="text-[0.84rem] text-slate-300 leading-relaxed">
                          {q.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "behavioral" && (
            <div className="pr-1">
              <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-slate-800/70">
                <h2 className="text-[1.05rem] font-semibold text-slate-50">
                  Behavioral questions
                </h2>
                <span className="text-xs text-slate-300 bg-slate-900/70 px-2 py-0.5 rounded-2xl border border-slate-700/80">
                  {behavioralQuestions.length} questions
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {behavioralQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden"
                  >
                    <div className="flex items-start gap-3 px-4 py-3">
                      <span className="text-[0.7rem] font-semibold text-sky-300 bg-sky-400/10 border border-sky-400/40 rounded-full px-2 py-0.5 mt-0.5">
                        Q{i + 1}
                      </span>
                      <p className="flex-1 text-sm font-medium text-slate-50 leading-relaxed">
                        {q.question}
                      </p>
                    </div>
                    <div className="px-4 pb-3 pt-2 border-t border-slate-800/80 space-y-3">
                      <div className="space-y-1">
                        <span className="inline-flex text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-indigo-300 bg-indigo-500/10 border border-indigo-400/40 rounded px-2 py-0.5">
                          Intention
                        </span>
                        <p className="text-[0.84rem] text-slate-300 leading-relaxed">
                          {q.intention}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="inline-flex text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-300 bg-emerald-400/10 border border-emerald-400/40 rounded px-2 py-0.5">
                          Model Answer
                        </span>
                        <p className="text-[0.84rem] text-slate-300 leading-relaxed">
                          {q.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "roadmap" && (
            <div className="pr-1">
              <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-slate-800/70">
                <h2 className="text-[1.05rem] font-semibold text-slate-50">
                  Preparation road map
                </h2>
                <span className="text-xs text-slate-300 bg-slate-900/70 px-2 py-0.5 rounded-2xl border border-slate-700/80">
                  {preparationPlan.length}-day plan
                </span>
              </div>
              <div className="relative flex flex-col">
                <div className="absolute left-7 top-0 bottom-0 w-0.5 rounded bg-linear-to-b from-indigo-400 via-sky-400 to-emerald-300" />
                {preparationPlan.map((day) => (
                  <div
                    key={day.day}
                    className="relative pl-14 py-3 flex flex-col gap-2"
                  >
                    <div className="absolute left-[1.1rem] top-4 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-sky-400" />
                    <div className="flex items-center gap-2">
                      <span className="text-[0.7rem] font-semibold text-sky-300 bg-sky-400/10 border border-sky-400/40 rounded-2xl px-2 py-0.5">
                        Day {day.day}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {day.focus}
                      </h3>
                    </div>
                    <ul className="m-0 p-0 flex flex-col gap-1 list-none">
                      {day.tasks.map((task, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[0.84rem] text-slate-300 leading-relaxed"
                        >
                          <span className="w-1 h-1 rounded-full bg-slate-500 mt-2" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right sidebar */}
        <aside className="relative flex w-full shrink-0 flex-col gap-5 border-t border-slate-800/70 bg-slate-950/60 p-4 md:w-60 md:border-t-0 md:p-7">
          {/* Match Score */}
          <div className="flex flex-col items-center gap-2.5">
            <p className="self-start text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Match Score
            </p>
            <div
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 ${ringClass}`}
            >
              <span className="text-[1.6rem] font-extrabold text-slate-50 leading-none">
                {report.matchScore}
              </span>
              <span className="text-[0.75rem] text-slate-400 -mt-0.5">%</span>
            </div>
            <p className="m-0 text-[0.75rem] text-emerald-300 text-center">
              Strong match for this role
            </p>
          </div>

          <div className="h-px bg-slate-800/70" />

          {/* Skill Gaps */}
          <div className="flex flex-col gap-3">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Skill Gaps
            </p>
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((gap, i) => (
                <span
                  key={i}
                  className={`text-xs font-medium px-2.5 py-1 rounded-md border backdrop-blur-sm ${severityClass(
                    gap.severity,
                  )}`}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
          {/* See all report option */}
          <button
            type="button"
            onClick={() => navigate("/results")}
            className="mt-auto w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-2xl text-sm text-slate-50 bg-slate-900/70 border border-slate-700/80 hover:bg-slate-800/80 transition-colors"
          >
            All generated reports
          </button>
        </aside>
      </div>
    </main>
  );
};

export default Interview;
