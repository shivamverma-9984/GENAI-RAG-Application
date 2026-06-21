import { useRef, useEffect, Fragment } from "react";
import { Bot, Send, Menu } from "lucide-react";

function ChatWindow({
  username,
  activeFile,
  messages,
  inputMessage,
  setInputMessage,
  isTyping,
  onSendMessage,
  onMenuToggle
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <main className="flex-1 flex flex-col h-screen bg-bg-primary relative overflow-hidden">
      <div className="flex items-center justify-between p-[16px_28px] border-b border-border-color bg-bg-glass backdrop-blur-md z-99">
        <div className="flex items-center gap-3">
          <button 
            className="hidden max-lg:flex items-center justify-center bg-transparent border-none text-text-secondary cursor-pointer p-1.5 rounded-xs transition-all duration-120 hover:bg-white/5 hover:text-text-primary" 
            onClick={onMenuToggle} 
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2.5 text-[0.95rem] font-bold text-text-primary max-w-[320px] truncate">
            <Bot size={18} className="text-accent-blue" />
            <span>{activeFile ? activeFile : "AI Assistant"}</span>
          </div>
        </div>
        <div className="text-[0.72rem] font-bold rounded-full bg-primary/10 text-accent-blue border border-primary/20 tracking-wide uppercase px-2.5 py-1">
          Gemini Powered
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-[32px_28px] flex flex-col gap-6 max-sm:p-[20px_16px]">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3.5 max-w-[80%] max-sm:max-w-[90%] animate-message-fade-in ${
              msg.type === "user" ? "self-end flex-row-reverse" : "self-start"
            }`}
          >
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-extrabold shrink-0 shadow-sm ${
              msg.type === "user"
                ? "bg-accent-blue/15 border-accent-blue/25 text-accent-cyan"
                : "bg-primary/15 border-primary/25 text-accent-blue"
            }`}>
              {msg.type === "bot" ? <Bot size={14} /> : username.charAt(0).toUpperCase()}
            </div>
            <div className={`dash-msg-bubble p-[14px_18px] rounded-md text-[0.925rem] leading-relaxed break-words shadow-sm ${
              msg.type === "bot"
                ? "bg-bg-card border border-border-color rounded-tl-xs text-text-primary"
                : "bg-gradient-to-r from-primary to-accent-blue text-white rounded-tr-xs"
            }`}>
              {msg.text.split("\n").map((line, lIdx) => (
                <Fragment key={lIdx}>
                  {line}
                  {lIdx < msg.text.split("\n").length - 1 && <br />}
                </Fragment>
              ))}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3.5 max-w-[80%] max-sm:max-w-[90%] animate-message-fade-in self-start">
            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-accent-blue text-xs font-extrabold shrink-0 shadow-sm">
              <Bot size={14} />
            </div>
            <div className="p-[14px_18px] rounded-md text-[0.925rem] leading-relaxed break-words shadow-sm bg-bg-card border border-border-color rounded-tl-xs text-text-primary">
              <div className="flex gap-[5px] p-[6px_4px] items-center">
                <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce-custom" style={{ animationDelay: "-0.32s" }} />
                <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce-custom" style={{ animationDelay: "-0.16s" }} />
                <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce-custom" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-end gap-3 p-[24px_28px] border-t border-border-color bg-bg-glass backdrop-blur-md max-sm:p-[16px_20px]">
        <div className="relative flex-1 flex">
          <textarea
            className="w-full bg-bg-input border border-border-color rounded-md p-[14px_18px] text-text-primary text-[0.925rem] resize-none min-h-[52px] max-h-[160px] outline-none transition-all duration-250 ease-in-out leading-[1.5] placeholder:text-text-muted focus:border-primary focus:bg-primary/3 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.15)]"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your document…"
            rows={1}
            aria-label="Message text area"
          />
        </div>
        <button 
          className="w-[52px] h-[52px] rounded-md border-none bg-gradient-to-r from-primary to-accent-blue text-white flex items-center justify-center cursor-pointer shrink-0 transition-all duration-250 ease-in-out shadow-[0_4px_12px_rgba(79,70,229,0.2)] hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(79,70,229,0.3)] active:translate-y-0 disabled:bg-bg-tertiary disabled:text-text-muted disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-50" 
          onClick={onSendMessage} 
          disabled={!inputMessage.trim() || isTyping}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </main>
  );
}

export default ChatWindow;
