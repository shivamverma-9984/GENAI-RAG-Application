import { useState } from "react";
import { Link } from "react-router-dom";
import { Bot, ArrowRight, Menu, X } from "lucide-react";

export default function Navbar({ token }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Home Navbar */}
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-bg-primary/70 backdrop-blur-md border-b border-border-color z-[1100] flex items-center transition-all duration-250 ease-in-out">
        <div className="w-full max-w-[1200px] mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer no-underline" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-8 h-8 rounded-xs bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white shadow-[0_0_12px_rgba(79,70,229,0.2)] shrink-0">
              <Bot size={18} />
            </div>
            <span className="text-[1.15rem] font-extrabold text-text-primary tracking-[-0.5px]">Insight AI</span>
          </Link>

          <nav className="flex items-center gap-8 max-md:hidden">
            <a href="#features" className="text-text-secondary no-underline text-sm font-semibold transition-all duration-120 hover:text-text-primary cursor-pointer">Features</a>
            <a href="#how-it-works" className="text-text-secondary no-underline text-sm font-semibold transition-all duration-120 hover:text-text-primary cursor-pointer">How It Works</a>
            <a href="#preview" className="text-text-secondary no-underline text-sm font-semibold transition-all duration-120 hover:text-text-primary cursor-pointer">Preview</a>
          </nav>

          <div className="flex items-center gap-4 max-md:hidden">
            {token ? (
              <Link to="/dashboard" className="bg-gradient-to-br from-primary to-accent-blue border-none text-white p-[11px_22px] rounded-sm text-sm font-semibold cursor-pointer transition-all duration-250 ease-in-out shadow-[0_4px_12px_rgba(79,70,229,0.25)] inline-flex items-center gap-2 hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] no-underline">
                Go to Dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link to="/signin" className="text-text-primary bg-transparent border border-border-color p-[10px_18px] rounded-sm text-sm font-semibold cursor-pointer transition-all duration-120 hover:bg-white/4 hover:border-border-hover no-underline">Sign In</Link>
                <Link to="/signup" className="bg-gradient-to-br from-primary to-accent-blue border-none text-white p-[11px_22px] rounded-sm text-sm font-semibold cursor-pointer transition-all duration-250 ease-in-out shadow-[0_4px_12px_rgba(79,70,229,0.25)] inline-flex items-center gap-2 hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] no-underline">
                  Get Started <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>

          <button 
            className="hidden max-md:flex items-center justify-center bg-transparent border-none text-text-secondary cursor-pointer p-1.5 rounded-xs transition-all duration-120 hover:text-text-primary hover:bg-white/5" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay Links */}
      <div className={`fixed top-[72px] left-0 right-0 bg-bg-secondary border-b border-border-color p-6 flex flex-col gap-5 z-[1050] -translate-y-[150%] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-lg ${
        mobileMenuOpen ? "translate-y-0" : ""
      }`}>
        <a href="#features" className="text-text-secondary no-underline text-sm font-semibold transition-all duration-120 hover:text-text-primary cursor-pointer text-base py-2 border-b border-white/2" onClick={() => setMobileMenuOpen(false)}>Features</a>
        <a href="#how-it-works" className="text-text-secondary no-underline text-sm font-semibold transition-all duration-120 hover:text-text-primary cursor-pointer text-base py-2 border-b border-white/2" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
        <a href="#preview" className="text-text-secondary no-underline text-sm font-semibold transition-all duration-120 hover:text-text-primary cursor-pointer text-base py-2 border-b border-white/2" onClick={() => setMobileMenuOpen(false)}>Preview</a>
        <div className="flex flex-col w-full mt-3 gap-2.5">
          {token ? (
            <Link to="/dashboard" className="bg-gradient-to-br from-primary to-accent-blue border-none text-white p-[11px_22px] rounded-sm text-sm font-semibold cursor-pointer transition-all duration-250 ease-in-out shadow-[0_4px_12px_rgba(79,70,229,0.25)] inline-flex items-center gap-2 hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] w-full justify-center no-underline" onClick={() => setMobileMenuOpen(false)}>
              Go to Dashboard <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link to="/signin" className="text-text-primary bg-transparent border border-border-color p-[10px_18px] rounded-sm text-sm font-semibold cursor-pointer transition-all duration-120 hover:bg-white/4 hover:border-border-hover w-full text-center py-2.5 no-underline mb-2" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/signup" className="bg-gradient-to-br from-primary to-accent-blue border-none text-white p-[11px_22px] rounded-sm text-sm font-semibold cursor-pointer transition-all duration-250 ease-in-out shadow-[0_4px_12px_rgba(79,70,229,0.25)] inline-flex items-center gap-2 hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] w-full justify-center no-underline" onClick={() => setMobileMenuOpen(false)}>Get Started <ArrowRight size={14} /></Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
