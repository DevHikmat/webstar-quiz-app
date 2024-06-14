import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
  isLogin: false,
  currentUser: null,
};

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authChangeStart: (state) => {
      state.isLoading = true;
    },
    authChangeSuccess: (state, action) => {
      state.isLoading = false;
      state.isLogin = true;
      state.currentUser = action.payload;
    },
    authChangeFailure: (state) => {
      state.isLoading = false;
    },
    authLogout: (state) => {
      state.currentUser = null;
      state.isLogin = false;
    },
  },
});
export const {
  authChangeStart,
  authChangeSuccess,
  authChangeFailure,
  authLogout,
} = userSlice.actions;
export default userSlice.reducer;
