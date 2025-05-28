import { clearCurrentUser } from "@/store/UserSlice";
import { useDispatch } from "react-redux";

const useLogout = () => {
  const dispatch = useDispatch();
  const logout = () => {
    localStorage.removeItem("token");
    dispatch(clearCurrentUser());
  };

  return logout;
};

export default useLogout;
