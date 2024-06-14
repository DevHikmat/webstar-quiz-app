import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  category: null,
  error: null,
  isChange: false,
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    changeCategoryStart: (state) => {
      state.isLoading = true;
    },
    changeCategorySuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    changeCategoryFailure: (state) => {
      state.isLoading = false;
    },
    getAllCategorySuccess: (state, action) => {
      state.isLoading = false;
      state.category = action.payload;
    },
  },
});
export const {
  changeCategoryStart,
  changeCategorySuccess,
  changeCategoryFailure,
  getAllCategorySuccess,
} = categorySlice.actions;
export default categorySlice.reducer;
