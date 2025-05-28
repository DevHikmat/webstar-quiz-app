import { configureStore } from '@reduxjs/toolkit'
import group from './groupSlice'
import user from './UserSlice'

export const store = configureStore({
  reducer: {
    group,
    user
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch