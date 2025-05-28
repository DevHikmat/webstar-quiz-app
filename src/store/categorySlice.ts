import { Category } from '@/types/api.type'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CategoryState {
  category: Category[] | null
}

const initialState: CategoryState = {
  category: null
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
   setCategories(state, action: PayloadAction<any>) {
    state.category = action.payload;
   }
  },
})

export const { setCategories } = categorySlice.actions
export default categorySlice.reducer