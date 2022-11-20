import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    userPhoto: "",
    userId: "",
    userRole: "",
    savedRecipes: [],
  },
  reducers: {
    reduxLogin: (state, action) => {
      const { username, userRole, userPhoto, savedRecipes, userId } =
        action.payload;
      state.username = username;
      state.userRole = userRole;
      state.userPhoto = userPhoto;
      state.savedRecipes = savedRecipes;
      state.userId = userId;
    },
    reduxLogout: (state) => {
      state.username = "";
      state.role = "";
    },
    editUserAccount: (state, action) => {
      const { data } = action.payload;
      state.role = data;
    },
  },
});

export const { reduxLogin, reduxLogout, editUserAccount } = userSlice.actions;

export default userSlice.reducer;
