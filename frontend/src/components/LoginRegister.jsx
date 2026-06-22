import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

// Helper to determine password strength
export const getPasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      label: "None",
      color: "rgba(255,255,255,0.05)",
      checks: { length: false, uppercase: false, lowercase: false, number: false, special: false }
    };
  }
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
  const score = Object.values(checks).filter(Boolean).length;
  
  let label = "Weak";
  let color = "#ef4444"; // Red
  if (score === 5) {
    label = "Very Strong";
    color = "#10b981"; // Green
  } else if (score === 4) {
    label = "Strong";
    color = "#3b82f6"; // Blue
  } else if (score === 3) {
    label = "Good";
    color = "#f59e0b"; // Yellow/Amber
  } else if (score === 2) {
    label = "Fair";
    color = "#f97316"; // Orange
  }
  return { score, label, color, checks };
};

export default function LoginRegister({
  isLoginMode,
  authForm,
  setAuthForm,
  authError,
  isSuccessAlert,
  authLoading,
  onSubmit,
  showVerifyLink,
  onVerifyClick
}) {
  const strength = getPasswordStrength(authForm.password);
  return (
    <>
      <div className="flex bg-bg-input rounded-sm p-1 mb-8 border border-border-color relative">
        <Link
          to="/signin"
          className={`flex-1 p-[10px] border-none rounded-xs bg-transparent text-sm font-semibold cursor-pointer transition-all duration-250 ease-in-out font-inherit text-center no-underline ${
            isLoginMode
              ? "bg-white/6 text-text-primary shadow-sm border border-white/5"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className={`flex-1 p-[10px] border-none rounded-xs bg-transparent text-sm font-semibold cursor-pointer transition-all duration-250 ease-in-out font-inherit text-center no-underline ${
            !isLoginMode
              ? "bg-white/6 text-text-primary shadow-sm border border-white/5"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Sign Up
        </Link>
      </div>

      <h2 className="text-[1.75rem] font-bold text-text-primary tracking-[-0.5px] mb-1.5">
        {isLoginMode ? "Welcome back" : "Create account"}
      </h2>
      <p className="text-sm text-text-secondary mb-7 leading-relaxed">
        {isLoginMode ? "Enter your credentials to continue" : "Fill in the details to get started"}
      </p>

      {authError && (
        <div
          className={`p-[12px_16px] rounded-sm text-sm mb-6 flex flex-col gap-2 leading-normal border-l-3 ${
            isSuccessAlert
              ? "bg-success-light text-success-text border-success-border border-l-success border"
              : "bg-error-light text-error-text border-error-border border-l-error border"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {authError}
          </div>
          {isLoginMode && showVerifyLink && (
            <button
              type="button"
              onClick={onVerifyClick}
              className="text-[0.8rem] text-accent-blue hover:text-accent-cyan cursor-pointer font-bold border-none bg-transparent self-start p-0 outline-none transition-all duration-120"
            >
              Verify your email now &rarr;
            </button>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {!isLoginMode && (
          <div className="flex flex-col gap-2">
            <label className="text-[0.75rem] font-bold text-text-secondary uppercase tracking-[0.8px]">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="Your display name"
              value={authForm.username}
              onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
              className="w-full p-[12px_16px] rounded-sm border border-border-color bg-bg-input text-text-primary text-[0.95rem] font-inherit outline-none transition-all duration-250 ease-in-out placeholder:text-text-muted focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.15)]"
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] font-bold text-text-secondary uppercase tracking-[0.8px]">
            Email address
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={authForm.email}
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            className="w-full p-[12px_16px] rounded-sm border border-border-color bg-bg-input text-text-primary text-[0.95rem] font-inherit outline-none transition-all duration-250 ease-in-out placeholder:text-text-muted focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.15)]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-[0.75rem] font-bold text-text-secondary uppercase tracking-[0.8px]">
              Password
            </label>
            {isLoginMode && (
              <Link
                to="/forgot-password"
                className="text-[0.75rem] text-accent-blue cursor-pointer font-semibold transition-all hover:text-accent-cyan no-underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            className="w-full p-[12px_16px] rounded-sm border border-border-color bg-bg-input text-text-primary text-[0.95rem] font-inherit outline-none transition-all duration-250 ease-in-out placeholder:text-text-muted focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.15)]"
          />
          {!isLoginMode && authForm.password && (
            <div className="flex flex-col gap-2.5 mt-2.5 p-3.5 rounded-sm bg-[#090f1e]/80 border border-border-color transition-all duration-300">
              <div className="flex justify-between items-center text-[0.72rem] font-bold">
                <span className="text-text-secondary uppercase tracking-[0.5px]">Password Strength: {strength.label}</span>
                <span style={{ color: strength.score === 5 ? "#34d399" : strength.score >= 4 ? "#60a5fa" : "#f87171" }}>
                  {strength.score}/5
                </span>
              </div>
              
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div 
                    key={index} 
                    className="h-full flex-1 transition-all duration-300 rounded-full"
                    style={{ 
                      backgroundColor: index <= strength.score ? strength.color : "rgba(255, 255, 255, 0.05)" 
                    }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1 text-[0.7rem] font-semibold text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-250 ${strength.checks.length ? "bg-success" : "bg-text-muted"}`} />
                  <span className={`transition-all duration-250 ${strength.checks.length ? "text-text-primary" : "text-text-muted"}`}>Min 8 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-250 ${strength.checks.uppercase ? "bg-success" : "bg-text-muted"}`} />
                  <span className={`transition-all duration-250 ${strength.checks.uppercase ? "text-text-primary" : "text-text-muted"}`}>Uppercase letter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-250 ${strength.checks.lowercase ? "bg-success" : "bg-text-muted"}`} />
                  <span className={`transition-all duration-250 ${strength.checks.lowercase ? "text-text-primary" : "text-text-muted"}`}>Lowercase letter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-250 ${strength.checks.number ? "bg-success" : "bg-text-muted"}`} />
                  <span className={`transition-all duration-250 ${strength.checks.number ? "text-text-primary" : "text-text-muted"}`}>One number</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-250 ${strength.checks.special ? "bg-success" : "bg-text-muted"}`} />
                  <span className={`transition-all duration-250 ${strength.checks.special ? "text-text-primary" : "text-text-muted"}`}>Special character (e.g. @$!%*?)</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={authLoading}
          className="mt-2 p-3.5 rounded-sm border-none bg-gradient-to-r from-primary to-accent-blue text-white text-[0.95rem] font-semibold cursor-pointer flex justify-center items-center gap-2 transition-all duration-250 ease-in-out font-inherit tracking-[0.3px] shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] active:translate-y-0 disabled:bg-bg-tertiary disabled:text-text-muted disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-60"
        >
          {authLoading ? <Loader2 className="animate-spin-custom" size={18} /> : (isLoginMode ? "Sign In" : "Create Account")}
        </button>
      </form>

      <p className="text-center mt-7 text-sm text-text-secondary">
        {isLoginMode ? "Don't have an account? " : "Already have an account? "}
        <Link
          to={isLoginMode ? "/signup" : "/signin"}
          className="text-accent-blue cursor-pointer font-semibold transition-all hover:text-accent-cyan no-underline"
        >
          {isLoginMode ? "Sign up free" : "Sign in"}
        </Link>
      </p>

      <p className="text-center mt-3 text-sm text-text-secondary">
        <Link
          to="/"
          className="text-text-secondary cursor-pointer font-medium transition-all hover:text-text-primary no-underline"
        >
          &larr; Back to Home
        </Link>
      </p>
    </>
  );
}
