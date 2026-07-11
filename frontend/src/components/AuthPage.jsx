import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bot } from "lucide-react";
import LoginRegister, { getPasswordStrength } from "./LoginRegister";
import ForgotPassword from "./ForgotPassword";
import VerifyEmail from "./VerifyEmail";

const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : "https://genai-rag-application-4aag.vercel.app";

function AuthPage({ onLoginSuccess, mode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginMode = mode === "signin";
  const isForgotMode = mode === "forgot";
  const isVerifyMode = mode === "verify";

  // Location states transferred during sign up
  const verifyEmail = location.state?.email || "";
  const verifySimCode = location.state?.simCode || "";

  const [authForm, setAuthForm] = useState({ username: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showVerifyLink, setShowVerifyLink] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [simulationCode, setSimulationCode] = useState("");

  const [verifyCode, setVerifyCode] = useState("");

  const isSuccessAlert = authError && (
    authError.toLowerCase().includes("successful") ||
    authError.toLowerCase().includes("verified") ||
    authError.toLowerCase().includes("sent") ||
    authError.toLowerCase().includes("generated") ||
    authError.toLowerCase().includes("simulation")
  );

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setShowVerifyLink(false);
    setUnverifiedEmail("");

    if (!isLoginMode) {
      const { score } = getPasswordStrength(authForm.password);
      if (score < 5) {
        setAuthError("Password must meet all strength requirements.");
        return;
      }
    }

    setAuthLoading(true);
    try {
      const endpoint = isLoginMode ? "/login" : "/register";
      const payload = isLoginMode
        ? { email: authForm.email, password: authForm.password }
        : authForm;
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      if (isLoginMode) {
        onLoginSuccess(res.data.access_token, res.data.username);
      } else {
        setAuthForm({ username: "", email: "", password: "" });
        showToastFromContext("Verification code sent to your email!", "success");
        navigate("/verify-email", { 
          state: { 
            email: authForm.email, 
            simCode: res.data.code || "" 
          } 
        });
      }
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Authentication failed";
      setAuthError(errMsg);
      if (isLoginMode && err.response?.status === 403 && errMsg.toLowerCase().includes("verify your email")) {
        setShowVerifyLink(true);
        setUnverifiedEmail(authForm.email);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyLinkClick = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/resend-verification`, { email: unverifiedEmail });
      showToastFromContext("Verification code sent to your email!", "success");
      navigate("/verify-email", { 
        state: { 
          email: unverifiedEmail, 
          simCode: res.data.code || "" 
        } 
      });
    } catch (err) {
      setAuthError(err.response?.data?.detail || "Failed to resend verification code");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/verify-email`, { email: verifyEmail, code: verifyCode });
      setAuthError("Email verified! You can now sign in.");
      setVerifyCode("");
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (err) {
      setAuthError(err.response?.data?.detail || "Verification failed");
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

    const { score } = getPasswordStrength(newPassword);
    if (score < 5) {
      setAuthError("Password must meet all strength requirements.");
      return;
    }

    setAuthLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/reset-password`, {
        email: forgotEmail,
        token: resetCode,
        new_password: newPassword,
      });
      setAuthError("Password reset successful. Please sign in.");
      setResetCode("");
      setNewPassword("");
      setSimulationCode("");
      setTimeout(() => {
        setForgotStep(1);
        setForgotEmail("");
        navigate("/signin");
      }, 1500);
    } catch (err) {
      setAuthError(err.response?.data?.detail || "Failed to reset password");
    } finally {
      setAuthLoading(false);
    }
  };

  // Helper trigger to show custom toast warnings if needed
  const showToastFromContext = (message) => {
    // Falls back to inline alert if toast context is not loaded yet
    setAuthError(message);
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-bg-primary relative">
      {/* Left hero display panel (Hidden on smaller screens) */}
      <div className="hidden lg:flex flex-[1.2] flex-col justify-between p-16 relative overflow-hidden border-r border-border-color bg-[radial-gradient(circle_at_80%_20%,rgba(79,70,229,0.15),transparent_45%),radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.12),transparent_45%)] bg-bg-secondary">
        <Link to="/" className="flex items-center gap-3 cursor-pointer no-underline">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white shadow-[0_0_16px_rgba(79,70,229,0.3)]">
            <Bot size={24} />
          </div>
          <span className="text-xl font-extrabold text-text-primary tracking-[-0.5px]">Insight AI</span>
        </Link>
        <div className="my-auto max-w-[480px] flex flex-col justify-center flex-1">
          <h1 className="text-5xl font-extrabold leading-[1.15] tracking-[-1.5px] mb-5 bg-gradient-to-r from-text-primary to-[#cbd5e1] bg-clip-text text-transparent">
            Chat with your<br />documents, instantly.
          </h1>
          <p className="text-[1.05rem] text-text-secondary leading-relaxed mb-10">
            Upload PDFs, Word docs, PowerPoints, spreadsheets, images and more — get precise answers powered by Gemini AI.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-text-secondary text-[0.95rem]">
              <span className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.5)] shrink-0" />
              PDF, DOCX, PPTX, XLSX, CSV, TXT & Images
            </div>
            <div className="flex items-center gap-3 text-text-secondary text-[0.95rem]">
              <span className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.5)] shrink-0" />
              Powered by Google Gemini
            </div>
            <div className="flex items-center gap-3 text-text-secondary text-[0.95rem]">
              <span className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.5)] shrink-0" />
              Secure & private
            </div>
          </div>
        </div>
      </div>

      {/* Right authentication forms panel */}
      <div className="flex-1 lg:flex-[0.95] bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)] bg-bg-primary flex items-center justify-center p-10 relative">
        <div className="w-full max-w-[400px] flex flex-col animate-auth-fade-in">
          {isVerifyMode ? (
            <VerifyEmail
              verifyEmail={verifyEmail}
              verifyCode={verifyCode}
              setVerifyCode={setVerifyCode}
              verifySimCode={verifySimCode}
              authError={authError}
              isSuccessAlert={isSuccessAlert}
              authLoading={authLoading}
              onSubmit={handleVerifySubmit}
              onBack={() => navigate("/signup")}
            />
          ) : isForgotMode ? (
            <ForgotPassword
              forgotStep={forgotStep}
              forgotEmail={forgotEmail}
              setForgotEmail={setForgotEmail}
              resetCode={resetCode}
              setResetCode={setResetCode}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              simulationCode={simulationCode}
              authError={authError}
              isSuccessAlert={isSuccessAlert}
              authLoading={authLoading}
              onForgotRequest={handleForgotRequest}
              onResetSubmit={handleResetSubmit}
              onBack={() => navigate("/signin")}
            />
          ) : (
            <LoginRegister
              isLoginMode={isLoginMode}
              setIsLoginMode={(loginMode) => navigate(loginMode ? "/signin" : "/signup")}
              authForm={authForm}
              setAuthForm={setAuthForm}
              authError={authError}
              isSuccessAlert={isSuccessAlert}
              authLoading={authLoading}
              onSubmit={handleAuthSubmit}
              onForgotClick={() => navigate("/forgot-password")}
              showVerifyLink={showVerifyLink}
              onVerifyClick={handleVerifyLinkClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
