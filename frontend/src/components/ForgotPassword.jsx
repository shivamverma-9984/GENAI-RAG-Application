import { Loader2 } from "lucide-react";
import { getPasswordStrength } from "./LoginRegister";

export default function ForgotPassword({
  forgotStep,
  forgotEmail,
  setForgotEmail,
  resetCode,
  setResetCode,
  newPassword,
  setNewPassword,
  simulationCode,
  authError,
  isSuccessAlert,
  authLoading,
  onForgotRequest,
  onResetSubmit,
  onBack
}) {
  const strength = getPasswordStrength(newPassword);
  return (
    <>
      <h2 className="text-[1.75rem] font-bold text-text-primary tracking-[-0.5px] mb-1.5">
        Reset password
      </h2>
      <p className="text-sm text-text-secondary mb-7 leading-relaxed">
        {forgotStep === 1
          ? "Enter your email to request a reset code"
          : "Enter the code and your new password"}
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

      {simulationCode && (
        <div className="bg-[#020617] border border-border-color rounded-sm p-3.5 mb-6 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)] font-mono">
          <div className="text-[0.75rem] text-text-muted uppercase tracking-[0.8px] mb-2 flex items-center gap-1.5 before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:bg-success before:rounded-full before:animate-pulse-custom">
            [Simulation Mode] Verification Code
          </div>
          <code className="text-2xl tracking-[2px] text-success-text font-bold flex items-center gap-2">
            {simulationCode}
          </code>
        </div>
      )}

      {forgotStep === 1 ? (
        <form onSubmit={onForgotRequest} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[0.75rem] font-bold text-text-secondary uppercase tracking-[0.8px]">
              Email address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full p-[12px_16px] rounded-sm border border-border-color bg-bg-input text-text-primary text-[0.95rem] font-inherit outline-none transition-all duration-250 ease-in-out placeholder:text-text-muted focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.15)]"
            />
          </div>
          <button
            type="submit"
            disabled={authLoading}
            className="mt-2 p-3.5 rounded-sm border-none bg-gradient-to-r from-primary to-accent-blue text-white text-[0.95rem] font-semibold cursor-pointer flex justify-center items-center gap-2 transition-all duration-250 ease-in-out font-inherit tracking-[0.3px] shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] active:translate-y-0 disabled:bg-bg-tertiary disabled:text-text-muted disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-60"
          >
            {authLoading ? <Loader2 className="animate-spin-custom" size={18} /> : "Send Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={onResetSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[0.75rem] font-bold text-text-secondary uppercase tracking-[0.8px]">
              Verification Code
            </label>
            <input
              type="text"
              required
              placeholder="123456"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="w-full p-[12px_16px] rounded-sm border border-border-color bg-bg-input text-text-primary text-[0.95rem] font-inherit outline-none transition-all duration-250 ease-in-out placeholder:text-text-muted focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.15)]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[0.75rem] font-bold text-text-secondary uppercase tracking-[0.8px]">
              New Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-[12px_16px] rounded-sm border border-border-color bg-bg-input text-text-primary text-[0.95rem] font-inherit outline-none transition-all duration-250 ease-in-out placeholder:text-text-muted focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.15)]"
            />
            {newPassword && (
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
            {authLoading ? <Loader2 className="animate-spin-custom" size={18} /> : "Reset Password"}
          </button>
        </form>
      )}

      <p className="text-center mt-7 text-sm text-text-secondary">
        Remember your password?{" "}
        <span
          onClick={onBack}
          className="text-accent-blue cursor-pointer font-semibold transition-all hover:text-accent-cyan"
        >
          Sign in
        </span>
      </p>
    </>
  );
}
