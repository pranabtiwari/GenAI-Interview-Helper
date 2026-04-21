import { createBrowserRouter } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { ProtectedRoutes } from "./components/protectedRoutes";
import Interview from "./pages/interview";
import Allresult from "./pages/Allresult";
import NavBar from "./components/NavBar";

export const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <NavBar />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "interview/:interviewId",
        element: (
          <ProtectedRoutes>
            <Interview />
          </ProtectedRoutes>
        ),
      },
      {
        path: "results",
        element: (
          <ProtectedRoutes>
            <Allresult />
          </ProtectedRoutes>
        ),
      },
    ],
  },
]);