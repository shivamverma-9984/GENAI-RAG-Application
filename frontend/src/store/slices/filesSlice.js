import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showToast } from "./uiSlice";

const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : "https://genai-rag-application-4aag.vercel.app";

export const fetchUserFiles = createAsyncThunk(
  "files/fetchUserFiles",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.token) return rejectWithValue("No auth token available");
    try {
      const res = await axios.get(`${API_BASE_URL}/files`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return res.data.files;
    } catch (err) {
      dispatch(showToast({ message: "Failed to fetch documents list.", type: "error" }));
      return rejectWithValue(err.message);
    }
  }
);

export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async (file, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.token) return rejectWithValue("No auth token available");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`
        },
      });
      dispatch(showToast({ message: `Successfully processed ${res.data.filename}!`, type: "success" }));
      dispatch(fetchUserFiles());
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Upload failed.";
      dispatch(showToast({ message: errMsg, type: "error" }));
      return rejectWithValue(errMsg);
    }
  }
);

export const selectFile = createAsyncThunk(
  "files/selectFile",
  async (filename, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.token) return rejectWithValue("No auth token available");
    try {
      await axios.post(`${API_BASE_URL}/files/select`, { filename }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      dispatch(showToast({ message: `Switched to "${filename}"`, type: "success" }));
      return filename;
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to load file.";
      dispatch(showToast({ message: errMsg, type: "error" }));
      return rejectWithValue(errMsg);
    }
  }
);

export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (filename, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.token) return rejectWithValue("No auth token available");
    try {
      await axios.delete(`${API_BASE_URL}/files/${encodeURIComponent(filename)}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      dispatch(showToast({ message: `Successfully deleted "${filename}"`, type: "success" }));
      dispatch(fetchUserFiles());
      return filename;
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Delete failed.";
      dispatch(showToast({ message: errMsg, type: "error" }));
      return rejectWithValue(errMsg);
    }
  }
);

const filesSlice = createSlice({
  name: "files",
  initialState: {
    userFiles: [],
    activeFile: null,
    isUploading: false,
    uploadStatus: { type: "", message: "" },
    fileLoading: false,
    filesLoading: false,
  },
  reducers: {
    clearFilesState: (state) => {
      state.userFiles = [];
      state.activeFile = null;
      state.isUploading = false;
      state.uploadStatus = { type: "", message: "" };
      state.fileLoading = false;
      state.filesLoading = false;
    },
    setUploadStatus: (state, action) => {
      state.uploadStatus = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUserFiles
      .addCase(fetchUserFiles.pending, (state) => {
        state.filesLoading = true;
      })
      .addCase(fetchUserFiles.fulfilled, (state, action) => {
        state.filesLoading = false;
        state.userFiles = action.payload;
      })
      .addCase(fetchUserFiles.rejected, (state) => {
        state.filesLoading = false;
      })
      // uploadFile
      .addCase(uploadFile.pending, (state) => {
        state.isUploading = true;
        state.uploadStatus = { type: "", message: "" };
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isUploading = false;
        state.activeFile = action.payload.filename;
        state.uploadStatus = {
          type: "success",
          message: `Uploaded & processed ${action.payload.chunks} chunks.`
        };
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadStatus = { type: "error", message: action.payload };
      })
      // selectFile
      .addCase(selectFile.pending, (state) => {
        state.fileLoading = true;
      })
      .addCase(selectFile.fulfilled, (state, action) => {
        state.fileLoading = false;
        state.activeFile = action.payload;
      })
      .addCase(selectFile.rejected, (state) => {
        state.fileLoading = false;
      })
      // deleteFile
      .addCase(deleteFile.pending, (state) => {
        state.filesLoading = true;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.filesLoading = false;
        if (state.activeFile === action.payload) {
          state.activeFile = null;
        }
      })
      .addCase(deleteFile.rejected, (state) => {
        state.filesLoading = false;
      });
  }
});

export const { clearFilesState, setUploadStatus } = filesSlice.actions;
export default filesSlice.reducer;
