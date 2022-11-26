import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    loadingProgress: "",
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    finishLoading: (state) => {
      state.loading = false;
    },
    setLoadingProgress: (state, action) => {
      const { finishPercentage } = action.payload;
      state.loadingProgress = finishPercentage;
    },
  },
});

export const { startLoading, finishLoading, setLoadingProgress } =
  loadingSlice.actions;

export default loadingSlice.reducer;
