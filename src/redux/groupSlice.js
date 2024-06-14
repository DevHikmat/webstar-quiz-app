import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  groups: null,
  error: null,
  isChange: false,
};

export const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    changeGroupStart: (state) => {
      state.isLoading = true;
    },
    changeGroupSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    changeGroupFailure: (state) => {
      state.isLoading = false;
    },
    getGroupsSuccess: (state, action) => {
      state.isLoading = false;
      state.groups = action.payload;
      state.error = null;
    },
  },
});
export const {
  changeGroupStart,
  changeGroupSuccess,
  changeGroupFailure,
  getGroupsSuccess,
} = groupSlice.actions;
export default groupSlice.reducer;
