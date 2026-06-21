export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="max-w-[1200px] w-full mx-auto p-[80px_24px]" style={{ borderTop: "1px solid var(--color-border-color)", background: "rgba(255,255,255,0.01)" }}>
      <div className="text-center mb-14">
        <div className="text-[0.75rem] font-bold p-[6px_14px] rounded-full bg-primary/10 text-[#a5b4fc] border border-primary/20 mb-6 tracking-wider uppercase inline-block">Step by Step</div>
        <h2 className="text-[2.25rem] font-extrabold tracking-tight mb-4">How Insight AI Works</h2>
        <p className="text-base text-text-secondary max-w-[500px] mx-auto">Extract document value in three incredibly simple, automated steps.</p>
      </div>

      <div className="flex justify-between gap-8 relative max-lg:flex-col max-lg:gap-10">
        <div className="group flex-1 flex flex-col items-center text-center relative z-2 max-lg:max-w-[320px] max-lg:mx-auto">
          <div className="w-12 h-12 rounded-full bg-bg-tertiary border-2 border-border-color text-text-primary text-[1.15rem] font-extrabold flex items-center justify-center mb-5 shadow-sm transition-all duration-250 ease-in-out group-hover:border-primary group-hover:text-accent-blue group-hover:shadow-[0_0_16px_rgba(79,70,229,0.2)]">1</div>
          <h4 className="text-[1.1rem] font-bold mb-2.5">Upload Files</h4>
          <p className="text-sm text-text-secondary leading-relaxed max-w-[260px] max-lg:max-w-[320px]">Drag and drop your document file directly into the secure dashboard workspace.</p>
        </div>
        <div className="group flex-1 flex flex-col items-center text-center relative z-2 max-lg:max-w-[320px] max-lg:mx-auto">
          <div className="w-12 h-12 rounded-full bg-bg-tertiary border-2 border-border-color text-text-primary text-[1.15rem] font-extrabold flex items-center justify-center mb-5 shadow-sm transition-all duration-250 ease-in-out group-hover:border-primary group-hover:text-accent-blue group-hover:shadow-[0_0_16px_rgba(79,70,229,0.2)]">2</div>
          <h4 className="text-[1.1rem] font-bold mb-2.5">Vector Indexing</h4>
          <p className="text-sm text-text-secondary leading-relaxed max-w-[260px] max-lg:max-w-[320px]">Our backend extracts content, splits text into clean chunks, and generates vector links.</p>
        </div>
        <div className="group flex-1 flex flex-col items-center text-center relative z-2 max-lg:max-w-[320px] max-lg:mx-auto">
          <div className="w-12 h-12 rounded-full bg-bg-tertiary border-2 border-border-color text-text-primary text-[1.15rem] font-extrabold flex items-center justify-center mb-5 shadow-sm transition-all duration-250 ease-in-out group-hover:border-primary group-hover:text-accent-blue group-hover:shadow-[0_0_16px_rgba(79,70,229,0.2)]">3</div>
          <h4 className="text-[1.1rem] font-bold mb-2.5">Chat and Query</h4>
          <p className="text-sm text-text-secondary leading-relaxed max-w-[260px] max-lg:max-w-[320px]">Ask questions in plain language, receive structured summaries, and click to inspect details.</p>
        </div>
      </div>
    </section>
  );
}
