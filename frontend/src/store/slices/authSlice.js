import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || "",
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { token, username } = action.payload;
      state.token = token;
      state.username = username;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
    },
    logout: (state) => {
      state.token = null;
      state.username = "";
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
