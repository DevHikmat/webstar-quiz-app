import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
  error: null,
  isChange: true,
};

export const questionSlice = createSlice({
  name: "questionList",
  initialState,
  reducers: {
    changeQueStart: (state) => {
      state.isLoading = true;
    },
    changeQueSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    changeQueFailure: (state) => {
      state.isLoading = false;
    },
  },
});
export const { changeQueStart, changeQueSuccess, changeQueFailure } =
  questionSlice.actions;
export default questionSlice.reducer;
