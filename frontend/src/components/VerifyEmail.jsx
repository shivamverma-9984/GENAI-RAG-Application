import { Loader2 } from "lucide-react";

export default function VerifyEmail({
  verifyEmail,
  verifyCode,
  setVerifyCode,
  verifySimCode,
  authError,
  isSuccessAlert,
  authLoading,
  onSubmit,
  onBack
}) {
  return (
    <>
      <h2 className="text-[1.75rem] font-bold text-text-primary tracking-[-0.5px] mb-1.5">
        Verify your email
      </h2>
      <p className="text-sm text-text-secondary mb-7 leading-relaxed">
        Enter the 6-digit code sent to <strong className="text-text-primary">{verifyEmail}</strong>
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

      {verifySimCode && (
        <div className="bg-[#020617] border border-border-color rounded-sm p-3.5 mb-6 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)] font-mono">
          <div className="text-[0.75rem] text-text-muted uppercase tracking-[0.8px] mb-2 flex items-center gap-1.5 before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:bg-success before:rounded-full before:animate-pulse-custom">
            [Simulation Mode] Verification Code
          </div>
          <code className="text-2xl tracking-[2px] text-success-text font-bold flex items-center gap-2">
            {verifySimCode}
          </code>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] font-bold text-text-secondary uppercase tracking-[0.8px]">
            Verification Code
          </label>
          <input
            type="text"
            required
            placeholder="123456"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            className="w-full p-[12px_16px] rounded-sm border border-border-color bg-bg-input text-text-primary text-[0.95rem] font-inherit outline-none transition-all duration-250 ease-in-out placeholder:text-text-muted focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.15)]"
          />
        </div>
        <button
          type="submit"
          disabled={authLoading}
          className="mt-2 p-3.5 rounded-sm border-none bg-gradient-to-r from-primary to-accent-blue text-white text-[0.95rem] font-semibold cursor-pointer flex justify-center items-center gap-2 transition-all duration-250 ease-in-out font-inherit tracking-[0.3px] shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] active:translate-y-0 disabled:bg-bg-tertiary disabled:text-text-muted disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-60"
        >
          {authLoading ? <Loader2 className="animate-spin-custom" size={18} /> : "Verify Email"}
        </button>
      </form>

      <p className="text-center mt-7 text-sm text-text-secondary">
        Wrong email?{" "}
        <span
          onClick={onBack}
          className="text-accent-blue cursor-pointer font-semibold transition-all hover:text-accent-cyan"
        >
          Go back
        </span>
      </p>
    </>
  );
}
