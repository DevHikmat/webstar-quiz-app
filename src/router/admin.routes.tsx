import Categories from "../pages/admin/Categories"
import { RouteObject } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Exams from "../pages/admin/Exams";
import StudentDetail from "@/pages/admin/studentDetail/StudentDetail";
import Teachers from "@/pages/admin/teachers/Teachers";
import Students from "@/pages/admin/students/Students";
import Groups from "@/pages/admin/groups/Groups";
import GroupDetail from "@/pages/admin/groupDetail/GroupDetail";

export const adminRoutes: RouteObject = {
  path: '/admin',
  element: <AdminLayout />, 
  children: [
    { index: true, path: "students/*", element: <Students /> },
    { path: "students/:id", element: <StudentDetail /> },
    { path: 'teachers', element: <Teachers /> },
    { path: 'groups', element: <Groups /> },
    { path: 'groups/:id', element: <GroupDetail /> },
    { path: 'exams', element: <Exams /> },
    { path: 'category', element: <Categories /> },
  ]
}
