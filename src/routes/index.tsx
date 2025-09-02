import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import { PageNotFound } from "../pages/PageNotFound";
import RegisterPage from "../pages/RegisterPage";
import Loginpage from "../pages/Loginpage";
import DashBoardPage from "../pages/DashBoardPage";
import { ProtectedRoute } from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/signup",
    element: <RegisterPage />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/login",
    element: <Loginpage />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashBoardPage />
      </ProtectedRoute>
    ),
    errorElement: <PageNotFound />,
  },
]);

export default router;
