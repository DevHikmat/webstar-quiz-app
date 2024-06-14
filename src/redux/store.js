import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import quiz from "./quizSlice";
import question from "./questionSlice";
import groups from "./groupSlice";
import users from "./userSlice";
import category from "./categorySlice";

export const store = configureStore({
  reducer: {
    auth,
    quiz,
    question,
    groups,
    users,
    category,
  },
});
