import { createSlice } from "@reduxjs/toolkit";

const allUsersSlice = createSlice({
  name: "user",
  initialState: {
    allUsers: [],
  },
  reducers: {
    getAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
  },
});

export const { getAllUsers } = allUsersSlice.actions;

export default allUsersSlice.reducer;
