import { configureStore } from '@reduxjs/toolkit'
import group from './groupSlice'
import user from './userSlice'
import quiz from './quizSlice'
import category from './categorySlice'

export const store = configureStore({
  reducer: {
    group,
    user,
    quiz,
    category
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch