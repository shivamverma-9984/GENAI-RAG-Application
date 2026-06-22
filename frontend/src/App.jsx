import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import ToastContainer from "./components/Toast";

import { loginSuccess, logout } from "./store/slices/authSlice";
import { showToast, dismissToast, setIsOpenMobile } from "./store/slices/uiSlice";
import { fetchUserFiles, uploadFile, selectFile, clearFilesState, deleteFile } from "./store/slices/filesSlice";
import { setInputMessage, clearChatState, addLocalUserMessage, sendMessage } from "./store/slices/chatSlice";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".pptx", ".txt", ".csv", ".xlsx", ".png", ".jpg", ".jpeg", ".webp"];

function AppRoutes() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux states
  const { token, username } = useSelector((state) => state.auth);
  const { toasts, isOpenMobile } = useSelector((state) => state.ui);
  const {
    userFiles,
    activeFile,
    isUploading,
    uploadStatus,
    fileLoading,
    filesLoading,
  } = useSelector((state) => state.files);
  const { messages, inputMessage, isTyping } = useSelector((state) => state.chat);

  // Local state for non-serializable File selection
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch(fetchUserFiles());
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token, dispatch]);

  const handleLoginSuccess = (accessToken, user) => {
    dispatch(loginSuccess({ token: accessToken, username: user }));
    dispatch(showToast({ message: `Welcome back, ${user}!`, type: "success" }));
    navigate("/dashboard");
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearFilesState());
    dispatch(clearChatState());
    dispatch(showToast({ message: "Signed out successfully.", type: "info" }));
    navigate("/");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const ext = "." + selectedFile.name.split(".").pop().toLowerCase();
      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        dispatch(showToast({ message: `Unsupported file type: ${ext}`, type: "warning" }));
        return;
      }
      setFile(selectedFile);
      dispatch(showToast({ message: `Selected file: ${selectedFile.name}`, type: "info" }));
    }
  };

  const handleUpload = () => {
    if (!file) return;
    dispatch(uploadFile(file)).then((actionResult) => {
      if (uploadFile.fulfilled.match(actionResult)) {
        setFile(null);
      }
    });
  };

  const handleSelectFile = (filename) => {
    if (filename === activeFile || fileLoading) return;
    dispatch(selectFile(filename));
  };

  const handleDeleteFile = (filename) => {
    dispatch(deleteFile(filename)).then((actionResult) => {
      if (deleteFile.fulfilled.match(actionResult)) {
        if (activeFile === filename) {
          dispatch(clearChatState());
        }
      }
    });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const userMsg = inputMessage;
    dispatch(addLocalUserMessage(userMsg));
    dispatch(setInputMessage(""));
    dispatch(sendMessage(userMsg));
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage token={token} />} />
        
        <Route 
          path="/signin" 
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onLoginSuccess={handleLoginSuccess} mode="signin" />
            )
          } 
        />

        <Route 
          path="/signup" 
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onLoginSuccess={handleLoginSuccess} mode="signup" />
            )
          } 
        />

        <Route 
          path="/forgot-password" 
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onLoginSuccess={handleLoginSuccess} mode="forgot" />
            )
          } 
        />

        <Route 
          path="/verify-email" 
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onLoginSuccess={handleLoginSuccess} mode="verify" />
            )
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            token ? (
              <div className="flex w-screen h-screen overflow-hidden bg-bg-primary">
                <Sidebar
                  username={username}
                  file={file}
                  isUploading={isUploading}
                  uploadStatus={uploadStatus}
                  userFiles={userFiles}
                  activeFile={activeFile}
                  onFileChange={handleFileChange}
                  onUpload={handleUpload}
                  onSelectFile={handleSelectFile}
                  onDeleteFile={handleDeleteFile}
                  onLogout={handleLogout}
                  isOpenMobile={isOpenMobile}
                  onCloseMobile={() => dispatch(setIsOpenMobile(false))}
                  filesLoading={filesLoading}
                />
                <ChatWindow
                  username={username}
                  activeFile={activeFile}
                  messages={messages}
                  inputMessage={inputMessage}
                  setInputMessage={(val) => dispatch(setInputMessage(val))}
                  isTyping={isTyping}
                  onSendMessage={handleSendMessage}
                  onMenuToggle={() => dispatch(setIsOpenMobile(true))}
                />
              </div>
            ) : (
              <Navigate to="/signin" replace />
            )
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer toasts={toasts} onClose={(id) => dispatch(dismissToast(id))} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
