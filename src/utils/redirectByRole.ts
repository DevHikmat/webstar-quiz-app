import { NavigateFunction } from "react-router-dom";
import { UserRole } from "../types/enum.type";

export const redirectByRole = (role: UserRole | string, navigate: NavigateFunction, pathname: string = "") => {
  if (pathname.includes(role)) return;
  switch (role) {
    case "admin": {
      navigate("/admin/students?page=1");
      break;
    }
    case "teacher":
      navigate("/teacher");
      break;
    case "student":
      navigate("/student");
      break;
    default:
      navigate("/");
  }
};
