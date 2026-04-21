import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useState } from "react";
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

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const response = await authLogout();
      console.log("Logout response:", response.message);
      navigate("/login");
    } catch (error) {
      console.log("Logout error", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-lg">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="text-sm font-semibold tracking-[0.18em] text-slate-100"
          >
            GENAI INTERVIEW
          </Link>

          <div className="flex items-center gap-1.5">
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
                  className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-200 transition-colors hover:bg-slate-800/70 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
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
        </nav>
      </header>

      <Outlet />
    </div>
  );
};

export default NavBar;
