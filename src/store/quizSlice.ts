import { QuizType } from '@/types/api.type'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface QuizState {
  quizzes: QuizType[] | null
}

const initialState: QuizState = {
  quizzes: null
}

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
   setQuizzes(state, action: PayloadAction<any>) {
    state.quizzes = action.payload;
   }
  },
})

export const { setQuizzes } = quizSlice.actions
export default quizSlice.reducer