import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { authLogout } from "../services/api.auth";

const navLinkClass = (active) =>
  `rounded-xl px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-colors ${
    active
      ? "bg-slate-100 text-slate-950"
      : "text-slate-200 hover:bg-slate-800/70 hover:text-white"
  }`;

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const response = await authLogout();
      console.log("Logout response:", response.message);
      setMobileMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.log("Logout error", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.2),transparent_35%),linear-gradient(180deg,#020617_0%,#020617_45%,#0f172a_100%)] text-slate-50">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-slate-100"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-sky-500 to-emerald-400 text-[0.65rem] text-white shadow-lg shadow-indigo-500/30">
              GI
            </span>
            <span className="hidden sm:block">GENAI INTERVIEW</span>
          </Link>

          <div className="hidden items-center gap-1.5 md:flex">
            {token ? (
              <>
                <Link
                  to="/"
                  className={navLinkClass(location.pathname === "/")}
                >
                  Home
                </Link>
                <Link
                  to="/results"
                  className={navLinkClass(
                    location.pathname.startsWith("/results"),
                  )}
                >
                  Reports
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-200 transition-colors hover:bg-slate-800/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={navLinkClass(
                    location.pathname.startsWith("/login"),
                  )}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={navLinkClass(
                    location.pathname.startsWith("/register"),
                  )}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-100 transition-colors hover:bg-white/10 md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-sidebar"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
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
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            )}
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md transition-opacity duration-200 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      >
        <aside
          id="mobile-sidebar"
          role="dialog"
          aria-modal="true"
          className={`absolute right-0 top-0 flex h-full w-[min(88vw,22rem)] flex-col border-l border-white/10 bg-slate-950/95 px-5 py-5 shadow-2xl shadow-black/40 transition-transform duration-200 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Menu
              </p>
              <p className="mt-1 text-sm text-slate-200">Navigate your workspace</p>
            </div>

            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-100 transition-colors hover:bg-white/10"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            {token ? (
              <>
                <Link
                  to="/"
                  className={`${navLinkClass(location.pathname === "/")} w-full text-left text-sm`}
                >
                  Home
                </Link>
                <Link
                  to="/results"
                  className={`${navLinkClass(
                    location.pathname.startsWith("/results"),
                  )} w-full text-left text-sm`}
                >
                  Reports
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-2 rounded-2xl border border-slate-700 px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-200 transition-colors hover:bg-slate-800/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${navLinkClass(
                    location.pathname.startsWith("/login"),
                  )} w-full text-left text-sm`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`${navLinkClass(
                    location.pathname.startsWith("/register"),
                  )} w-full text-left text-sm`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </aside>
      </div>

      <Outlet />
    </div>
  );
};

export default NavBar;
