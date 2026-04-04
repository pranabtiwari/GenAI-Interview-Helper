
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getInterviewReportById } from "../services/api.interview.js";

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
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center">
        <h1 className="text-lg font-semibold">Loading your interview plan...</h1>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="w-full min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center">
        <p className="text-sm text-red-400">{error || "No interview report found."}</p>
      </main>
    );
  }

  const technicalQuestions = report.techniQuestion || [];
  const behavioralQuestions = report.behavQuestion || [];
  const preparationPlan = report.preparationPlan || [];
  const skillGaps = report.skillGaps || [];
  const ringClass = scoreRingClass(report.matchScore || 0);

  return (
    <main className="w-full min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans flex items-stretch p-6 box-border">
      <div className="flex w-full max-w-5xl mx-auto bg-[#161b22] border border-[#2a3348] rounded-2xl justify-between overflow-hidden">
        {/* Left nav (static) */}
        <nav className="w-56 flex-shrink-0 p-7 flex flex-col justify-between gap-1">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#7d8590] mb-2 px-3">
              Sections
            </p>

            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#e6edf3] bg-[#1c2230] border border-[#2a3348]">
              <span className="flex items-center">
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
              Technical Questions
            </button>

            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#7d8590] hover:bg-[#1c2230] hover:text-[#e6edf3] mt-1.5 transition-colors">
              <span className="flex items-center">
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
              Behavioral Questions
            </button>

            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#7d8590] hover:bg-[#1c2230] hover:text-[#e6edf3] mt-1.5 transition-colors">
              <span className="flex items-center">
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
              Road Map
            </button>
          </div>

          <button className="inline-flex items-center justify-center rounded-lg bg-[#ff2d78] px-3 py-2 text-xs font-medium text-white shadow hover:bg-[#ff4a8c] transition-colors">
            <svg
              height="14"
              className="mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" />
            </svg>
            Download Resume
          </button>
        </nav>

        {/* Divider */}
        <div className="w-px bg-[#2a3348] flex-shrink-0" />

        {/* Center content: show all sections (no nav logic) */}
        <section className="flex-1 px-8 py-7 overflow-y-auto max-h-[calc(100vh-3rem)] space-y-8">
          {/* Technical Questions */}
          <div>
            <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-[#2a3348]">
              <h2 className="text-[1.1rem] font-bold text-[#e6edf3]">
                Technical Questions
              </h2>
              <span className="text-xs text-[#7d8590] bg-[#1c2230] px-2 py-0.5 rounded-2xl border border-[#2a3348]">
                {technicalQuestions.length} questions
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {technicalQuestions.map((q, i) => (
                <div
                  key={i}
                  className="bg-[#1c2230] border border-[#2a3348] rounded-lg overflow-hidden"
                >
                  <div className="flex items-start gap-3 px-4 py-3">
                    <span className="text-[0.7rem] font-bold text-[#ff2d78] bg-[#ff2d781a] border border-[#ff2d7833] rounded px-1.5 py-0.5 mt-0.5">
                      Q{i + 1}
                    </span>
                    <p className="flex-1 text-sm font-medium text-[#e6edf3] leading-relaxed">
                      {q.question}
                    </p>
                  </div>
                  <div className="px-4 pb-3 pt-2 border-t border-[#2a3348] space-y-3">
                    <div className="space-y-1">
                      <span className="inline-flex text-[0.68rem] font-bold uppercase tracking-[0.06em] text-[#a78bfa] bg-[#a78bfa1a] border border-[#a78bfa33] rounded px-2 py-0.5">
                        Intention
                      </span>
                      <p className="text-[0.84rem] text-[#9ca3af] leading-relaxed">
                        {q.intention}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="inline-flex text-[0.68rem] font-bold uppercase tracking-[0.06em] text-[#3fb950] bg-[#3fb9501a] border border-[#3fb95033] rounded px-2 py-0.5">
                        Model Answer
                      </span>
                      <p className="text-[0.84rem] text-[#9ca3af] leading-relaxed">
                        {q.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Questions */}
          <div>
            <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-[#2a3348]">
              <h2 className="text-[1.1rem] font-bold text-[#e6edf3]">
                Behavioral Questions
              </h2>
              <span className="text-xs text-[#7d8590] bg-[#1c2230] px-2 py-0.5 rounded-2xl border border-[#2a3348]">
                {behavioralQuestions.length} questions
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {behavioralQuestions.map((q, i) => (
                <div
                  key={i}
                  className="bg-[#1c2230] border border-[#2a3348] rounded-lg overflow-hidden"
                >
                  <div className="flex items-start gap-3 px-4 py-3">
                    <span className="text-[0.7rem] font-bold text-[#ff2d78] bg-[#ff2d781a] border border-[#ff2d7833] rounded px-1.5 py-0.5 mt-0.5">
                      Q{i + 1}
                    </span>
                    <p className="flex-1 text-sm font-medium text-[#e6edf3] leading-relaxed">
                      {q.question}
                    </p>
                  </div>
                  <div className="px-4 pb-3 pt-2 border-t border-[#2a3348] space-y-3">
                    <div className="space-y-1">
                      <span className="inline-flex text-[0.68rem] font-bold uppercase tracking-[0.06em] text-[#a78bfa] bg-[#a78bfa1a] border border-[#a78bfa33] rounded px-2 py-0.5">
                        Intention
                      </span>
                      <p className="text-[0.84rem] text-[#9ca3af] leading-relaxed">
                        {q.intention}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="inline-flex text-[0.68rem] font-bold uppercase tracking-[0.06em] text-[#3fb950] bg-[#3fb9501a] border border-[#3fb95033] rounded px-2 py-0.5">
                        Model Answer
                      </span>
                      <p className="text-[0.84rem] text-[#9ca3af] leading-relaxed">
                        {q.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Road Map */}
          <div>
            <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-[#2a3348]">
              <h2 className="text-[1.1rem] font-bold text-[#e6edf3]">
                Preparation Road Map
              </h2>
              <span className="text-xs text-[#7d8590] bg-[#1c2230] px-2 py-0.5 rounded-2xl border border-[#2a3348]">
                {preparationPlan.length}-day plan
              </span>
            </div>
            <div className="relative flex flex-col">
              <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#ff2d78] to-[#ff2d781a] rounded" />
              {preparationPlan.map((day) => (
                <div
                  key={day.day}
                  className="relative pl-14 py-3 flex flex-col gap-2"
                >
                  <div className="absolute left-[1.1rem] top-4 w-3.5 h-3.5 rounded-full bg-[#161b22] border-2 border-[#ff2d78]" />
                  <div className="flex items-center gap-2">
                    <span className="text-[0.7rem] font-bold text-[#ff2d78] bg-[#ff2d781a] border border-[#ff2d7840] rounded-2xl px-2 py-0.5">
                      Day {day.day}
                    </span>
                    <h3 className="text-sm font-semibold text-[#e6edf3]">
                      {day.focus}
                    </h3>
                  </div>
                  <ul className="m-0 p-0 flex flex-col gap-1 list-none">
                    {day.tasks.map((task, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[0.84rem] text-[#9ca3af] leading-relaxed"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#7d8590] mt-2" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-px bg-[#2a3348] flex-shrink-0" />

        {/* Right sidebar */}
        <aside className="w-60 flex-shrink-0 p-7 flex flex-col gap-5">
          {/* Match Score */}
          <div className="flex flex-col items-center gap-2.5">
            <p className="self-start text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#7d8590]">
              Match Score
            </p>
            <div
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 ${ringClass}`}
            >
              <span className="text-[1.6rem] font-extrabold text-[#e6edf3] leading-none">
                {report.matchScore}
              </span>
              <span className="text-[0.75rem] text-[#7d8590] -mt-0.5">%</span>
            </div>
            <p className="m-0 text-[0.75rem] text-[#3fb950] text-center">
              Strong match for this role
            </p>
          </div>

          <div className="h-px bg-[#2a3348]" />

          {/* Skill Gaps */}
          <div className="flex flex-col gap-3">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#7d8590]">
              Skill Gaps
            </p>
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((gap, i) => (
                <span
                  key={i}
                  className={`text-xs font-medium px-2.5 py-1 rounded-md border ${severityClass(
                    gap.severity
                  )}`}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Interview;