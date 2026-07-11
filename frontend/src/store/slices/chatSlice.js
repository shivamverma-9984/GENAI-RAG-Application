import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showToast } from "./uiSlice";
import { selectFile, uploadFile } from "./filesSlice";

const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : "https://genaiapp-nine.vercel.app/";

const initialBotMessage = { type: "bot", text: "Hello! Please upload a file to get started. Supported: PDF, DOCX, PPTX, XLSX, CSV, TXT, and Images." };

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageText, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.token) return rejectWithValue("No auth token available");
    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, { query: messageText }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return res.data.answer;
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Sorry, I encountered an error while trying to answer your question.";
      dispatch(showToast({ message: "Response generation failed.", type: "error" }));
      return rejectWithValue(errMsg);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [initialBotMessage],
    inputMessage: "",
    isTyping: false
  },
  reducers: {
    setInputMessage: (state, action) => {
      state.inputMessage = action.payload;
    },
    clearChatState: (state) => {
      state.messages = [initialBotMessage];
      state.inputMessage = "";
      state.isTyping = false;
    },
    addLocalUserMessage: (state, action) => {
      state.messages.push({ type: "user", text: action.payload });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isTyping = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isTyping = false;
        state.messages.push({ type: "bot", text: action.payload });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isTyping = false;
        state.messages.push({ type: "bot", text: action.payload });
      })
      // When a file is uploaded, add bot ready message
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.messages.push({
          type: "bot",
          text: `"${action.payload.filename}" is ready! What would you like to know?`
        });
      })
      // When a file is selected, add switch message
      .addCase(selectFile.fulfilled, (state, action) => {
        state.messages.push({
          type: "bot",
          text: `Switched to "${action.payload}". Ask me anything about it!`
        });
      });
  }
});

export const { setInputMessage, clearChatState, addLocalUserMessage } = chatSlice.actions;
export default chatSlice.reducer;
