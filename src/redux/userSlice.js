import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    userPhoto: "",
    userId: "",
    userRole: "",
    savedRecipes: [],
    userDocumentId: "",
  },
  reducers: {
    reduxLogin: (state, action) => {
      const {
        username,
        userRole,
        userPhoto,
        savedRecipes,
        userId,
        userDocumentId,
      } = action.payload;
      state.username = username;
      state.userRole = userRole;
      state.userPhoto = userPhoto;
      state.savedRecipes = savedRecipes;
      state.userId = userId;
      state.userDocumentId = userDocumentId;
    },
    reduxLogout: (state) => {
      state.username = "";
      state.userPhoto = "";
      state.userId = "";
      state.userRole = "";
      state.savedRecipes = [];
      state.userDocumentId = "";
    },
    updateSavedRecipes: (state, action) => {
      const { data } = action.payload;
      state.savedRecipes = data;
    },
  },
});

export const { reduxLogin, reduxLogout, editUserAccount, updateSavedRecipes } =
  userSlice.actions;

export default userSlice.reducer;
