import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { RootState } from "../store/store";
import { setCurrentUser } from "../store/userSlice";
import { getMe } from "../services/authService";
import { redirectByRole } from "../utils/redirectByRole";

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const token = localStorage.getItem("token");
  const { currentUser } = useSelector((state: RootState) => state.user);

  const {
    data: user,
    isLoading,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token,
    retry: 1,
  });

  useEffect(() => {
    const isAuthPage = pathname === "/login" || pathname === "/signup";
  
    if (!token && !isAuthPage) {
      navigate("/login");
      return;
    }
  
    if (user && !currentUser) {
      dispatch(setCurrentUser(user));
      redirectByRole(user.role, navigate, pathname);
    }
  }, [token, user, currentUser, dispatch, navigate, pathname]);

  return {
    isLoading,
    currentUser,
  };
};
