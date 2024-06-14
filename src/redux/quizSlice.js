import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
  isChange: false,
  currentQuiz: null,
  quizList: null,
  error: null,
  studentAnswers: [],
  isExamStart: false,
  isFinished: false,
  totalScore: {
    correctCount: 0,
    wrongAttemps: [],
  },
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    changeQuizStart: (state) => {
      state.isLoading = true;
    },
    changeQuizSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    changeQuizFailure: (state) => {
      state.isLoading = false;
    },
    getQuizSuccess: (state, action) => {
      state.isLoading = false;
      state.quizList = action.payload;
    },
    getOneQuizSuccess: (state, action) => {
      state.isLoading = false;
      state.currentQuiz = action.payload;
    },
    quizExamStart: (state) => {
      state.isExamStart = true;
      state.isFinished = false;
    },
    quizFinishSuccess: (state, action) => {
      state.isExamStart = false;
      state.isFinished = true;
      state.totalScore = action.payload;
    },
    quizFinishFromButton: (state) => {
      state.isExamStart = false;
      state.isFinished = true;
    },
  },
});
export const {
  changeQuizStart,
  changeQuizSuccess,
  changeQuizFailure,
  getQuizSuccess,
  getOneQuizSuccess,
  quizExamStart,
  quizFinishSuccess,
  quizFinishFromButton,
} = quizSlice.actions;
export default quizSlice.reducer;
