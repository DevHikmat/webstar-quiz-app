import { useRoutes } from "react-router-dom";
import TeacherDashboard from "../pages/teacher";
import ProtectedRoute from "./ProtectedRoute";
import { UserRole } from "../types/enum.type";
import Login from "../pages/login";
import Signup from "../pages/signup";
import { adminRoutes } from "./admin.routes";
import { studentRoutes } from "./student.routes";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <ProtectedRoute allowedRoles={[UserRole.GUEST]}>
          <h1>This is Home page</h1>
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/teacher",
      element: (
        <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
          <TeacherDashboard />
        </ProtectedRoute>
      ),
    },
    {
      ...studentRoutes,
      path: "/student",
      element: (
        <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
          {studentRoutes.element}
        </ProtectedRoute>
      ),
    },
    {
      path: "/unauthorized",
      element: <div>Access Denied</div>,
    },
    {
      ...adminRoutes,
      element: (
        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
          {adminRoutes.element}
        </ProtectedRoute>
      ),
    },
  ]);

  return routes;
};
export default AppRoutes;
