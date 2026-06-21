import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import filesReducer from "./slices/filesSlice";
import chatReducer from "./slices/chatSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
});
