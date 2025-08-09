"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SendHorizonal, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { askQuestion } from "./action";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function AIChatComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") || "";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await askQuestion(inputValue, sessionId);
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        content: response.answer,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "Sorry, I encountered an error processing your request.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, scaleY: 0.8, originY: 1 },
    visible: { opacity: 1, scaleY: 1, originY: 1 },
    exit: { opacity: 0, scaleY: 0.8, originY: 1 },
  };

  return (
    <div
      className={`w-full relative ${!isChatOpen ? "border border-black" : ""}`}
    >
      {!isChatOpen && (
        <Button
          className="w-full flex items-center gap-2"
          onClick={() => setIsChatOpen(true)}
        >
          <Sparkles className="h-4 w-4" />
          Heidi AI
        </Button>
      )}

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={messageVariants}
            transition={{ duration: 0.3 }}
            className="absolute bottom-full left-0 w-full bg-gradient-card rounded-xl p-4 shadow-lg border border-border/50 backdrop-blur-sm flex flex-col mb-2" // Changed positioning
            style={{ maxHeight: "70vh" }} // Adjust as needed
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Ask Heidi AI</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
              >
                ✕
              </Button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto mb-2 rounded-lg bg-background/50 p-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-70 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start mb-3">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-secondary text-secondary-foreground">
                    <div className="flex items-center gap-2">
                      <div className="dot-flashing"></div>
                      <span className="text-sm">Heidi is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Heidi..."
                className="pr-12 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 bottom-2 h-8 w-8"
                disabled={!inputValue.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizonal className="h-4 w-4" />
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thinking animation style */}
      <style jsx>{`
        .dot-flashing {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #6366f1;
          animation: dot-flashing 1s infinite linear alternate;
        }
        .dot-flashing::before,
        .dot-flashing::after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #6366f1;
        }
        .dot-flashing::before {
          left: -15px;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 0s;
        }
        .dot-flashing::after {
          left: 15px;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 1s;
        }
        @keyframes dot-flashing {
          0% {
            background-color: #6366f1;
          }
          50%,
          100% {
            background-color: rgba(99, 102, 241, 0.2);
          }
        }
      `}</style>
    </div>
  );
}
