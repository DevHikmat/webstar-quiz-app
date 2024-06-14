import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isChange: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    changeUserStart: (state) => {
      state.isLoading = true;
    },
    changeUserSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    changeUserFailure: (state) => {
      state.isLoading = false;
    },
    getAllUsersSuccess: (state) => {
      state.isLoading = false;
    },
  },
});
export const {
  changeUserStart,
  changeUserSuccess,
  changeUserFailure,
  getAllUsersSuccess,
} = userSlice.actions;
export default userSlice.reducer;
