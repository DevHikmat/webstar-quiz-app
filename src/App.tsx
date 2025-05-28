import AppRoutes from "./router/AppRoutes";
import { useAuth } from "./hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getAllGroup } from "./services/groupService";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setGroups } from "./store/groupSlice";
import { getAllQuiz } from "./services/quizService";
import { setQuizzes } from "./store/quizSlice";
import { getAllCategory } from "./services/categoryService";
import { setCategories } from "./store/categorySlice";

function App() {
  const { isLoading } = useAuth();
  const { data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: getAllGroup
  })
  const { data: quizzes } = useQuery({
    queryKey: ["groups"],
    queryFn: getAllQuiz
  })
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategory
  })
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setGroups(groups))
    dispatch(setQuizzes(quizzes))
    dispatch(setCategories(categories))
  }, [groups, quizzes, categories])

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="app">
      <AppRoutes />
    </div>
  );
}

export default App;
