import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserService } from "./services/UserService";
import {
  authChangeStart,
  authChangeSuccess,
  authChangeFailure,
} from "./redux/authSlice";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Student from "./pages/student/Student";
import Admin from "./pages/admin/Admin";
import Teacher from "./pages/teacher/Teacher";
import { setAxiosInstanceToken } from "./services/axiosInstance";

const adminRoute = [{ path: "/admin/*", element: <Admin /> }];
const teacherRoute = [{ path: "/teacher/*", element: <Teacher /> }];
const studentRoute = [{ path: "/student/*", element: <Student /> }];

function App() {
  const { auth, quiz } = useSelector((state) => state);
  const { isLogin } = auth;
  const { isFinished } = quiz;

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [protectedRoute, setProtectedRoute] = useState(null);

  const getCurrentUser = async (token) => {
    setAxiosInstanceToken(token);
    dispatch(authChangeStart());
    const id = localStorage.getItem("id");
    try {
      const data = await UserService.getOneUser(id);
      if (data.role === "admin") {
        setProtectedRoute(adminRoute);
        !location.pathname.startsWith("/admin") && navigate("/admin");
      } else if (data.role === "teacher") {
        setProtectedRoute(teacherRoute);
        !location.pathname.startsWith("/teacher") && navigate("/teacher");
      } else if (data.role === "student") {
        setProtectedRoute(studentRoute);
        !location.pathname.startsWith("/student") && navigate("/student");
      }
      dispatch(authChangeSuccess(data));
    } catch (error) {
      dispatch(authChangeFailure());
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) getCurrentUser(token);
    else navigate("/login");
  }, [isLogin, isFinished]);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {protectedRoute?.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}

export default App;
