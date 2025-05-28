import StudentLayout from "@/layouts/StudentLayout";
import QuizDetail from "@/pages/student/exam/QuizDetail";
import ExamList from "@/pages/student/exam/QuizList";
import { RouteObject } from "react-router-dom";

export const studentRoutes: RouteObject = {
  path: "/student",
  element: <StudentLayout />,
  children: [
    { index: true, path: "exam", element: <ExamList /> },
    { path: "exam/:id", element: <QuizDetail /> },
    { path: "homework", element: <div>homework</div> },
    { path: "history", element: <div>history</div> },
    { path: "settings", element: <div>settings</div> },
  ],
};
