import { FileText, Cpu, ShieldCheck } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="max-w-[1200px] w-full mx-auto p-[80px_24px]" style={{ borderTop: "1px solid var(--color-border-color)" }}>
      <div className="text-center mb-14">
        <div className="text-[0.75rem] font-bold p-[6px_14px] rounded-full bg-primary/10 text-[#a5b4fc] border border-primary/20 mb-6 tracking-wider uppercase inline-block">Key Capabilities</div>
        <h2 className="text-[2.25rem] font-extrabold tracking-tight mb-4">Engineered for Document Intelligence</h2>
        <p className="text-base text-text-secondary max-w-[500px] mx-auto">A premium feature stack designed to parse, index, and query your documents instantly.</p>
      </div>

      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
        <div className="p-8 rounded-md bg-bg-card/40 border border-border-color transition-all duration-250 ease-in-out flex flex-col items-start text-left hover:border-primary hover:bg-bg-card/60 hover:-translate-y-0.5 hover:shadow-md">
          <div className="w-11 h-11 rounded-xs bg-primary/10 text-accent-blue flex items-center justify-center mb-5">
            <FileText size={20} />
          </div>
          <h3 className="text-[1.15rem] font-bold mb-3 text-text-primary">Multi-format Engine</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Upload PDFs, DOCX files, PowerPoint slides, Excel spreadsheets, CSV data, txt files, and images (PNG, JPEG, WebP) seamlessly.</p>
        </div>

        <div className="p-8 rounded-md bg-bg-card/40 border border-border-color transition-all duration-250 ease-in-out flex flex-col items-start text-left hover:border-primary hover:bg-bg-card/60 hover:-translate-y-0.5 hover:shadow-md">
          <div className="w-11 h-11 rounded-xs bg-primary/10 text-accent-blue flex items-center justify-center mb-5">
            <Cpu size={20} />
          </div>
          <h3 className="text-[1.15rem] font-bold mb-3 text-text-primary">Powered by Gemini</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Leverages Google Gemini LLM API to understand semantic intent and deliver precise answers based only on context.</p>
        </div>

        <div className="p-8 rounded-md bg-bg-card/40 border border-border-color transition-all duration-250 ease-in-out flex flex-col items-start text-left hover:border-primary hover:bg-bg-card/60 hover:-translate-y-0.5 hover:shadow-md">
          <div className="w-11 h-11 rounded-xs bg-primary/10 text-accent-blue flex items-center justify-center mb-5">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-[1.15rem] font-bold mb-3 text-text-primary">Secure Session RAG</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Your session context is securely parsed and processed locally in temporary storage. No persistent leaks or external data mining.</p>
        </div>
      </div>
    </section>
  );
}
