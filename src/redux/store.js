import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import allUserReducer from "./allUsersSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    allUsers: allUserReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
