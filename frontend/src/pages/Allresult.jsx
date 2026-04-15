

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAllInterviewReports } from "../services/api.interview.js";

const Allresult = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllInterviewReports();
        // backend returns { message, interviewReports }
        setReports(response.data.interviewReports || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load interview reports.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleOpenReport = (id) => {
    navigate(`/interview/${id}`);
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex items-center justify-center">
        <h1 className="text-base font-medium text-slate-200">Loading your past interview plans...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          <p className="font-semibold mb-1">Error</p>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 font-sans flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-white/10 bg-white/5 shadow-[0_18px_60px_rgba(15,23,42,0.75)] backdrop-blur-xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_45%),_radial-gradient(circle_at_bottom,_#22c55e_0,_transparent_45%)]" />

        <div className="relative p-6 md:p-8 space-y-6">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Saved interview plans
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
                Your generated interview results
              </h1>
              <p className="text-sm text-slate-300">
                Revisit previously generated interview plans and open any report
                to see the full questions, roadmap, and skill gaps.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800/80"
            >
              New interview plan
            </button>
          </header>

          {reports.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-slate-700/60 bg-slate-900/60 px-5 py-6 text-sm text-slate-300 flex flex-col items-center justify-center gap-2">
              <p>You don't have any interview reports yet.</p>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-1 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-4 py-2 text-xs font-medium text-white shadow hover:from-indigo-400 hover:via-sky-400 hover:to-emerald-300"
              >
                Generate your first report
              </button>
            </div>
          ) : (
            <section className="mt-2 space-y-3">
              {reports.map((report) => {
                const createdAt = report.createdAt
                  ? new Date(report.createdAt).toLocaleString()
                  : null;
                const jd = report.jobDescription || "No job description";
                const snippet = jd.length > 140 ? `${jd.slice(0, 140)}...` : jd;

                return (
                  <article
                    key={report._id}
                    className="group flex flex-col md:flex-row md:items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-4 hover:border-indigo-400/70 hover:bg-slate-900/70 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Job description
                      </p>
                      <p className="text-sm text-slate-100 leading-relaxed">
                        {snippet}
                      </p>
                      {createdAt && (
                        <p className="text-[0.75rem] text-slate-400 mt-1">
                          Generated on {createdAt}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-row md:flex-col items-end md:items-center gap-3 md:gap-2 md:w-40">
                      {typeof report.matchScore === "number" && (
                        <div className="flex flex-col items-end md:items-center gap-1">
                          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Match score
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                            {report.matchScore}%
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenReport(report._id)}
                        className="inline-flex items-center justify-center rounded-2xl bg-indigo-500/90 px-4 py-2 text-xs font-medium text-white shadow hover:bg-indigo-400"
                      >
                        Open report
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default Allresult;