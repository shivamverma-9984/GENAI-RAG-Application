import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginRegister({
  isLoginMode,
  authForm,
  setAuthForm,
  authError,
  isSuccessAlert,
  authLoading,
  onSubmit
}) {
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
          className={`p-[12px_16px] rounded-sm text-sm mb-6 flex items-center gap-2.5 leading-normal border-l-3 ${
            isSuccessAlert
              ? "bg-success-light text-success-text border-success-border border-l-success border"
              : "bg-error-light text-error-text border-error-border border-l-error border"
          }`}
        >
          {authError}
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
