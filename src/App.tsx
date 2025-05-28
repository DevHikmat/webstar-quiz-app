import AppRoutes from "./router/AppRoutes";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="app">
      <AppRoutes />
    </div>
  );
}

export default App;
