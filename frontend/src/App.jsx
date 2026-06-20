import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { UploadCloud, File, Send, Loader2, Bot, LogOut, FileText, CheckCircle } from "lucide-react";
import "./App.css";

const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : "https://genai-rag-application-y2zq.onrender.com";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authForm, setAuthForm] = useState({ username: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [simulationCode, setSimulationCode] = useState("");

  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: "", message: "" });
  const [userFiles, setUserFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);

  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello! Please upload a file to get started. Supported: PDF, DOCX, PPTX, XLSX, CSV, TXT, and Images." },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const fetchUserFiles = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/files`);
      setUserFiles(res.data.files);
    } catch {}
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserFiles();
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const endpoint = isLoginMode ? "/login" : "/register";
      const payload = isLoginMode
        ? { email: authForm.email, password: authForm.password }
        : authForm;
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      if (isLoginMode) {
        setToken(res.data.access_token);
        setUsername(res.data.username);
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("username", res.data.username);
      } else {
        setIsLoginMode(true);
        setAuthForm({ username: "", email: "", password: "" });
        setAuthError("Registration successful. Please login.");
      }
    } catch (err) {
      setAuthError(err.response?.data?.detail || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    setSimulationCode("");
    try {
      const res = await axios.post(`${API_BASE_URL}/forgot-password`, { email: forgotEmail });
      if (res.data.token) {
        setSimulationCode(res.data.token);
        setAuthError("Verification code generated! (Simulation mode)");
      } else {
        setAuthError("Verification code sent to your email!");
      }
      setForgotStep(2);
    } catch (err) {
      setAuthError(err.response?.data?.detail || "Failed to send code");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/reset-password`, {
        email: forgotEmail,
        token: resetCode,
        new_password: newPassword
      });
      setAuthError("Password reset successful. Please sign in.");
      setIsForgotMode(false);
      setForgotStep(1);
      setForgotEmail("");
      setResetCode("");
      setNewPassword("");
      setSimulationCode("");
      setIsLoginMode(true);
    } catch (err) {
      setAuthError(err.response?.data?.detail || "Failed to reset password");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setMessages([{ type: "bot", text: "Hello! Please upload a PDF file to get started. Then you can ask me any questions about it." }]);
    setFile(null);
    setUploadStatus({ type: "", message: "" });
    setUserFiles([]);
    setActiveFile(null);
  };

  const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".pptx", ".txt", ".csv", ".xlsx", ".png", ".jpg", ".jpeg", ".webp"];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const ext = "." + selectedFile.name.split(".").pop().toLowerCase();
      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        setUploadStatus({ type: "error", message: "Unsupported file type." });
        return;
      }
      setFile(selectedFile);
      setUploadStatus({ type: "", message: "" });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadStatus({ type: "", message: "" });
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setActiveFile(response.data.filename);
      setFile(null);
      setUploadStatus({ type: "success", message: `Uploaded & processed ${response.data.chunks} chunks.` });
      setMessages((prev) => [...prev, { type: "bot", text: `"${response.data.filename}" is ready! What would you like to know?` }]);
      await fetchUserFiles();
    } catch (error) {
      setUploadStatus({ type: "error", message: error.response?.data?.detail || "Upload failed." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectFile = async (filename) => {
    if (filename === activeFile || fileLoading) return;
    setFileLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/files/select`, { filename });
      setActiveFile(filename);
      setMessages((prev) => [...prev, { type: "bot", text: `Switched to "${filename}". Ask me anything about it!` }]);
    } catch (error) {
      setUploadStatus({ type: "error", message: error.response?.data?.detail || "Failed to load file." });
    } finally {
      setFileLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage("");
    setMessages((prev) => [...prev, { type: "user", text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        query: userMsg,
      });
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: response.data.answer },
      ]);
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text:
            error.response?.data?.detail ||
            "Sorry, I encountered an error while trying to answer your question.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <div className="auth-brand">
            <div className="auth-brand-icon"><Bot size={26} /></div>
            <span>Insight AI</span>
          </div>
          <h1 className="auth-hero-title">Chat with your<br />documents, instantly.</h1>
          <p className="auth-hero-sub">Upload PDFs, Word docs, PowerPoints, spreadsheets, images and more — get precise answers powered by Gemini AI.</p>
          <div className="auth-features">
            <div className="auth-feature-item"><span className="auth-feature-dot" />PDF, DOCX, PPTX, XLSX, CSV, TXT & Images</div>
            <div className="auth-feature-item"><span className="auth-feature-dot" />Powered by Google Gemini</div>
            <div className="auth-feature-item"><span className="auth-feature-dot" />Secure & private</div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            {isForgotMode ? (
              <>
                <h2 className="auth-card-title">Reset password</h2>
                <p className="auth-card-sub">
                  {forgotStep === 1 
                    ? "Enter your email to request a reset code" 
                    : "Enter the code and your new password"}
                </p>

                {authError && (
                  <div className={`auth-alert ${authError.includes("successful") || authError.includes("sent") ? "auth-alert-success" : "auth-alert-error"}`}>
                    {authError}
                  </div>
                )}

                {simulationCode && (
                  <div className="auth-alert auth-alert-success" style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>[Simulation Mode] Verification Code:</div>
                    <code style={{ fontSize: "1.1rem", letterSpacing: "1px", color: "#10b981", fontWeight: 700 }}>{simulationCode}</code>
                  </div>
                )}

                {forgotStep === 1 ? (
                  <form onSubmit={handleForgotRequest} className="auth-form">
                    <div className="auth-field">
                      <label>Email address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="you@example.com" 
                        value={forgotEmail} 
                        onChange={e => setForgotEmail(e.target.value)} 
                      />
                    </div>
                    <button type="submit" disabled={authLoading} className="auth-submit-btn">
                      {authLoading ? <Loader2 className="spin" size={18} /> : "Send Code"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetSubmit} className="auth-form">
                    <div className="auth-field">
                      <label>Verification Code</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="123456" 
                        value={resetCode} 
                        onChange={e => setResetCode(e.target.value)} 
                      />
                    </div>
                    <div className="auth-field">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="••••••••" 
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} 
                      />
                    </div>
                    <button type="submit" disabled={authLoading} className="auth-submit-btn">
                      {authLoading ? <Loader2 className="spin" size={18} /> : "Reset Password"}
                    </button>
                  </form>
                )}

                <p className="auth-switch">
                  Remember your password?{" "}
                  <span onClick={() => { setIsForgotMode(false); setForgotStep(1); setAuthError(""); setSimulationCode(""); }}>
                    Sign in
                  </span>
                </p>
              </>
            ) : (
              <>
                <div className="auth-tab-row">
                  <button className={`auth-tab ${isLoginMode ? 'active' : ''}`} onClick={() => { setIsLoginMode(true); setAuthError(""); }}>Sign In</button>
                  <button className={`auth-tab ${!isLoginMode ? 'active' : ''}`} onClick={() => { setIsLoginMode(false); setAuthError(""); }}>Sign Up</button>
                </div>

                <h2 className="auth-card-title">{isLoginMode ? "Welcome back" : "Create account"}</h2>
                <p className="auth-card-sub">{isLoginMode ? "Enter your credentials to continue" : "Fill in the details to get started"}</p>

                {authError && (
                  <div className={`auth-alert ${authError.includes("successful") ? "auth-alert-success" : "auth-alert-error"}`}>
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="auth-form">
                  {!isLoginMode && (
                    <div className="auth-field">
                      <label>Username</label>
                      <input type="text" required placeholder="Your display name" value={authForm.username} onChange={e => setAuthForm({...authForm, username: e.target.value})} />
                    </div>
                  )}
                  <div className="auth-field">
                    <label>Email address</label>
                    <input type="email" required placeholder="you@example.com" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
                  </div>
                  <div className="auth-field">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label>Password</label>
                      {isLoginMode && (
                        <span onClick={() => { setIsForgotMode(true); setForgotStep(1); setAuthError(""); }} style={{ fontSize: "0.75rem", color: "#60a5fa", cursor: "pointer", fontWeight: 600 }}>
                          Forgot password?
                        </span>
                      )}
                    </div>
                    <input type="password" required placeholder="••••••••" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
                  </div>
                  <button type="submit" disabled={authLoading} className="auth-submit-btn">
                    {authLoading ? <Loader2 className="spin" size={18} /> : (isLoginMode ? "Sign In" : "Create Account")}
                  </button>
                </form>

                <p className="auth-switch">
                  {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                  <span onClick={() => { setIsLoginMode(!isLoginMode); setAuthError(""); }}>
                    {isLoginMode ? "Sign up free" : "Sign in"}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <div className="dash-logo-icon"><Bot size={20} /></div>
          <span>Insight AI</span>
        </div>

        <div className="dash-user-card">
          <div className="dash-avatar">{username.charAt(0).toUpperCase()}</div>
          <div>
            <div className="dash-username">{username}</div>
            <div className="dash-user-role">Pro User</div>
          </div>
        </div>

        <div className="dash-section-label">Upload New</div>

        <label className="dash-dropzone" htmlFor="file-upload">
          <div className="dash-dropzone-icon">
            {file ? <File size={22} /> : <UploadCloud size={22} />}
          </div>
          <div className="dash-dropzone-text">
            <span>{file ? file.name : "Upload File"}</span>
            <small>{file ? "Ready to process" : "PDF, DOCX, PPTX, XLSX, CSV, TXT, Image"}</small>
          </div>
        </label>
        <input id="file-upload" type="file" accept=".pdf,.docx,.pptx,.txt,.csv,.xlsx,.png,.jpg,.jpeg,.webp" onChange={handleFileChange} style={{ display: "none" }} />

        <button className="dash-process-btn" onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? <><Loader2 className="spin" size={16} /> Processing…</> : "Process Document"}
        </button>

        {uploadStatus.message && (
          <div className={`dash-status dash-status-${uploadStatus.type}`}>{uploadStatus.message}</div>
        )}

        <div className="dash-section-label" style={{ marginTop: '16px' }}>Your Documents</div>

        <div className="dash-file-list">
          {userFiles.length === 0 ? (
            <div className="dash-file-empty">No files uploaded yet</div>
          ) : (
            userFiles.map((f) => (
              <div
                key={f.key}
                className={`dash-file-item ${activeFile === f.filename ? 'active' : ''}`}
                onClick={() => handleSelectFile(f.filename)}
              >
                <FileText size={16} />
                <span>{f.filename}</span>
                {activeFile === f.filename && <CheckCircle size={14} className="dash-file-check" />}
              </div>
            ))
          )}
        </div>

        <div className="dash-sidebar-footer">
          <button className="dash-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main chat area */}
      <main className="dash-main">
        <div className="dash-topbar">
          <div className="dash-topbar-title">
            <Bot size={18} />
            <span>{activeFile ? activeFile : "AI Assistant"}</span>
          </div>
          <div className="dash-topbar-badge">Gemini Powered</div>
        </div>

        <div className="dash-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`dash-msg dash-msg-${msg.type}`}>
              {msg.type === "bot" && (
                <div className="dash-msg-avatar"><Bot size={14} /></div>
              )}
              <div className="dash-msg-bubble">{msg.text}</div>
              {msg.type === "user" && (
                <div className="dash-msg-avatar dash-msg-avatar-user">{username.charAt(0).toUpperCase()}</div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="dash-msg dash-msg-bot">
              <div className="dash-msg-avatar"><Bot size={14} /></div>
              <div className="dash-msg-bubble">
                <div className="loader">
                  <div className="loader-dot" />
                  <div className="loader-dot" />
                  <div className="loader-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="dash-input-row">
          <textarea
            className="dash-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your document…"
            rows={1}
          />
          <button className="dash-send-btn" onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
            <Send size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
