import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isOpenMobile: false,
    toasts: []
  },
  reducers: {
    setIsOpenMobile: (state, action) => {
      state.isOpenMobile = action.payload;
    },
    showToast: (state, action) => {
      const { message, type = "info" } = action.payload;
      const id = Date.now().toString() + Math.random().toString();
      state.toasts.push({ id, message, type });
    },
    dismissToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    }
  }
});

export const { setIsOpenMobile, showToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
