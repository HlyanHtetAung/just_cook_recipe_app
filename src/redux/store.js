import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import allUserReducer from "./allUsersSlice";
import loadingReducer from "./loadingSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    allUsers: allUserReducer,
    loading: loadingReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
