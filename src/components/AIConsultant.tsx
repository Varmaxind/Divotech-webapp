import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function AIConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          history: messages
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.text || "I was unable to formulate a response at this time. Please try rephrasing your inquiry.";
        const modelMessage: Message = { role: "model", parts: [{ text }] };
        setMessages(prev => [...prev, modelMessage]);
      } else {
        const errorText = response.status === 503 
          ? "Our AI technical assistant is currently in offline mode. Please feel free to submit a contact inquiry, or reach us directly at info@divotech.in."
          : "We encountered a temporary connection issue. Please try again shortly or contact support at info@divotech.in.";
        const modelMessage: Message = { role: "model", parts: [{ text: errorText }] };
        setMessages(prev => [...prev, modelMessage]);
      }
    } catch (error) {
      console.error("Consultation Error:", error);
      const modelMessage: Message = { role: "model", parts: [{ text: "Network connection lost. Please verify your internet connection and try again." }] };
      setMessages(prev => [...prev, modelMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 flex items-center justify-between text-white border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="bg-blue-700 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white">Divo Tech Advisor</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Expert Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm inline-block">
                    <Sparkles className="h-8 w-8 text-blue-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 mb-1">How can I help with your</p>
                    <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">HV Requirements?</p>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-2 px-6">
                    <button onClick={() => setInput("Tell me about benchtop units")} className="text-[10px] bg-white border border-slate-200 hover:border-blue-700 text-slate-500 p-2.5 rounded-xl uppercase font-bold transition-all hover:text-blue-700 shadow-sm">Benchtop Units</button>
                    <button onClick={() => setInput("What DC-DC solutions do you have?")} className="text-[10px] bg-white border border-slate-200 hover:border-blue-700 text-slate-500 p-2.5 rounded-xl uppercase font-bold transition-all hover:text-blue-700 shadow-sm">DC-DC Modules</button>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-2.5", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "model" && <div className="h-8 w-8 rounded-lg bg-blue-700 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20"><Bot className="h-4 w-4 text-white" /></div>}
                  <div className={cn("max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed", m.role === "user" ? "bg-slate-900 text-white rounded-tr-none shadow-lg" : "bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-none")}>
                    {m.parts[0].text}
                  </div>
                  {m.role === "user" && <div className="h-8 w-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0"><User className="h-4 w-4 text-slate-600" /></div>}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="h-8 w-8 rounded-lg bg-blue-700 flex items-center justify-center flex-shrink-0 shadow-md"><Bot className="h-4 w-4 text-white" /></div>
                  <div className="bg-white border border-slate-100 p-3.5 rounded-2xl flex items-center gap-2 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-700" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Processing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Inquire about KV range..."
                  className="w-full bg-slate-100 border-none rounded-xl py-3.5 pl-4 pr-12 text-sm focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-blue-700 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-all text-white shadow-md shadow-blue-500/20"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-700 text-white h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:bg-blue-800 border border-white/10"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
