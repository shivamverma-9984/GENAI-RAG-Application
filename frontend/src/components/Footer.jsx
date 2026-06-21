import { Link } from "react-router-dom";
import { Bot } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border-color bg-bg-secondary p-[48px_24px]">
      <div className="max-w-[1200px] w-full mx-auto flex justify-between items-center flex-wrap gap-6 max-sm:flex-col max-sm:text-center">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-6 h-6 rounded-xs bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white shadow-[0_0_12px_rgba(79,70,229,0.2)] shrink-0">
            <Bot size={14} />
          </div>
          <span className="text-[1rem] font-bold text-white">Insight AI</span>
        </Link>

        <div className="text-[0.8rem] text-text-muted">
          &copy; {new Date().getFullYear()} Insight AI Inc. All rights reserved.
        </div>

        <div className="flex gap-6">
          <a href="#features" className="text-[0.8rem] text-text-secondary no-underline transition-all duration-120 hover:text-text-primary">Features</a>
          <a href="#how-it-works" className="text-[0.8rem] text-text-secondary no-underline transition-all duration-120 hover:text-text-primary">How It Works</a>
          <a href="#preview" className="text-[0.8rem] text-text-secondary no-underline transition-all duration-120 hover:text-text-primary">Preview</a>
        </div>
      </div>
    </footer>
  );
}
