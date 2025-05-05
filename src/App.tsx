import { useEffect } from "react";
import AppRoutes from "./router/AppRoutes";
import { useLocation, useNavigate } from "react-router-dom";
import { redirectByRole } from "./utils/redirectByRole";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "./services/authService";

function App() {
  const { pathname } = useLocation();
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: !!localStorage.getItem('token'), 
    retry: 1, 
  });
  const navigate = useNavigate();

  const handleCheckOldAuth = async () => {
    if (!data) return;
    redirectByRole(data.role, navigate, pathname);
  };

  useEffect(() => {
    handleCheckOldAuth();
  }, [data]);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="app">
      <AppRoutes />
    </div>
  );
}

export default App;
