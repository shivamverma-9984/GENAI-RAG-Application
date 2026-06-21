import { Link } from "react-router-dom";
import { Bot, ArrowRight, FilePlus, FileText, Sparkles, Menu } from "lucide-react";

export default function HeroSection({ token }) {
  return (
    <section className="mt-[72px] p-[100px_24px_64px] flex flex-col items-center text-center relative">
      <div className="flex items-center  text-[0.75rem] font-bold p-[14px_14px] rounded-full bg-primary/10 text-[#a5b4fc] border border-primary/20 mb-6 tracking-wider uppercase">
        <Sparkles size={12} style={{ marginRight: "6px", verticalAlign: "middle" }} />
        <p> Introducing Document Chat 2.0</p>
      </div>
      <h1 className="text-[4rem] max-sm:text-[2.75rem] font-extrabold leading-tight tracking-tight max-w-[840px] mb-6 bg-gradient-to-b from-text-primary to-[#cbd5e1] bg-clip-text text-transparent">
        Chat with your <span className="bg-gradient-to-r from-accent-blue via-primary to-accent-cyan bg-clip-text text-transparent">documents</span> <br />in seconds.
      </h1>
      <p className="text-lg max-sm:text-base text-text-secondary leading-relaxed max-w-[620px] mb-10">
        Unlock instant answers and summarize complex content from PDFs, Word docs, spreadsheets, slides, and images using advanced Gemini AI.
      </p>

      <div className="flex items-center gap-4 mb-16 max-sm:flex-col max-sm:w-full max-sm:max-w-[280px]">
        {token ? (
          <Link to="/dashboard" className="bg-gradient-to-br from-primary to-accent-blue border-none text-white p-[11px_22px] rounded-sm text-sm font-semibold cursor-pointer transition-all duration-250 ease-in-out shadow-[0_4px_12px_rgba(79,70,229,0.25)] inline-flex items-center gap-2 hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] max-sm:w-full max-sm:justify-center no-underline">
            Go to Dashboard <ArrowRight size={16} />
          </Link>
        ) : (
          <>
            <Link to="/signup" className="bg-gradient-to-br from-primary to-accent-blue border-none text-white p-[11px_22px] rounded-sm text-sm font-semibold cursor-pointer transition-all duration-250 ease-in-out shadow-[0_4px_12px_rgba(79,70,229,0.25)] inline-flex items-center gap-2 hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] max-sm:w-full max-sm:justify-center no-underline">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <a href="#features" className="bg-white/3 border border-border-color text-text-primary p-[11px_22px] rounded-sm text-sm font-semibold cursor-pointer transition-all duration-120 hover:bg-white/6 hover:border-border-hover max-sm:w-full max-sm:justify-center animate-none" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              Learn More
            </a>
          </>
        )}
      </div>

      {/* Mock visual application preview container */}
      <div id="preview" className="w-full max-w-[960px] bg-bg-card/40 border border-border-color rounded-lg p-3 shadow-lg shadow-glow relative">
        <div className="border border-white/5 rounded-md overflow-hidden aspect-[16/9] max-sm:aspect-[4/3] bg-bg-secondary flex items-center justify-center">
          <div className="flex w-full h-full bg-[#0a0f1d]">
            {/* Mock Sidebar - Hidden on mobile screens */}
            <div className="hidden sm:flex w-[30%] bg-[#060912] border-r border-white/4 p-3.5 flex-col gap-3 text-left">
              <div className="flex items-center gap-1.5 text-[0.8rem] font-bold text-white">
                <div className="w-6 h-6 rounded-xs bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white shadow-[0_0_12px_rgba(79,70,229,0.2)] shrink-0"><Bot size={12} /></div>
                <span>Insight AI</span>
              </div>
              <div className="h-[30px] bg-white/2 rounded-md flex items-center px-2.5 text-[0.7rem] text-text-secondary border border-dashed border-white/10">
                <FilePlus size={12} style={{ marginRight: "6px", color: "var(--color-accent-blue)" }} /> Upload File
              </div>
              <div className="text-[0.6rem] uppercase text-text-muted font-bold">Your Documents</div>
              <div className="bg-primary-light border border-primary/20 h-32 rounded-md flex items-center px-2 text-[0.7rem] text-accent-blue">
                <FileText size={12} style={{ marginRight: "6px" }} />
                <span className="truncate">annual_report.pdf</span>
              </div>
            </div>
            {/* Mock Workspace Panel */}
            <div className="flex-1 flex flex-col bg-[#090d18] min-w-0">
              {/* Mock Workspace Header */}
              <div className="h-10 border-b border-white/4 flex items-center justify-between px-4 text-[0.75rem] text-white font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Menu size={12} className="text-text-secondary sm:hidden shrink-0" />
                  <Bot size={14} className="text-accent-blue shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">annual_report.pdf</span>
                </div>
                <div className="bg-primary/15 color-primary-text text-[0.6rem] px-2 py-0.5 rounded-full font-bold text-accent-blue border border-primary/20 shrink-0">Gemini RAG</div>
              </div>
              {/* Mock Workspace Chat Thread */}
              <div className="flex-1 p-3.5 sm:p-4 flex flex-col gap-2.5 sm:gap-3 text-left overflow-y-auto">
                <div className="self-end max-w-[80%] sm:max-w-[70%] bg-gradient-to-br from-primary to-accent-blue text-white rounded-md rounded-tr-xs p-2 text-[0.7rem]">
                  What was our revenue growth in Q3 2025?
                </div>
                <div className="flex gap-2 self-start max-w-[90%] sm:max-w-[80%]">
                  <div className="w-5.5 h-5.5 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-accent-blue shrink-0"><Bot size={10} /></div>
                  <div className="bg-bg-card border border-border-color text-text-primary rounded-md rounded-tl-xs p-2 text-[0.7rem] leading-relaxed">
                    According to page 4 of the report, Q3 2025 revenue grew by <strong>18.4% YoY</strong>, driven by cloud service subscriptions.
                  </div>
                </div>
              </div>
              {/* Mock Workspace Bottom Input panel */}
              <div className="h-11 border-t border-white/4 flex items-center px-3 gap-2 shrink-0">
                <div className="flex-1 h-7 bg-white/2 rounded-md border border-white/6 flex items-center px-2.5 text-[0.7rem] text-text-muted truncate">Ask anything about the report...</div>
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white shrink-0"><ArrowRight size={14} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
