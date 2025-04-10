import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard")); // We'll create this next

const routes = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [{ path: "", element: <Login /> }],
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ path: "", element: <Login /> }],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [{ path: "", element: <Register /> }],
  },
];

export default routes;
