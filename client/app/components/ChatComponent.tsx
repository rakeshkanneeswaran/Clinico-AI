"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, SendHorizonal, Sparkles, RefreshCw } from "lucide-react";
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
  const [lastUserQuery, setLastUserQuery] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the chat container
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") || "";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Add effect to handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If chat is open and click is outside of chat container, close the chat
      if (
        isChatOpen &&
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node)
      ) {
        setIsChatOpen(false);
      }
    }

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen]); // Only re-run if isChatOpen changes

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
    setLastUserQuery(inputValue);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await askQuestion(inputValue, sessionId);

      // Keep animation for 3s before showing reply
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          content: response.answer,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: "Sorry, I encountered an error processing your request.",
            role: "assistant",
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }, 3000);
      console.error("Error asking question:", error);
    }
  };

  const handleRegenerate = async () => {
    if (!lastUserQuery || isLoading) return;

    setIsLoading(true);
    try {
      const response = await askQuestion(lastUserQuery, sessionId);

      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          content: response.answer,
          role: "assistant",
          timestamp: new Date(),
        };

        // Replace last assistant message with new one
        setMessages((prev) => {
          const withoutLastAssistant = [...prev].filter(
            (msg, idx) => !(msg.role === "assistant" && idx === prev.length - 1)
          );
          return [...withoutLastAssistant, assistantMessage];
        });
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error regenerating:", error);
      setIsLoading(false);
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <div className="w-full relative" ref={chatContainerRef}>
      {!isChatOpen && (
        <Button
          className="w-full flex items-center gap-2 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition"
          onClick={() => setIsChatOpen(true)}
        >
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <div className="font-medium">Clinico AI</div>
          <span className="text-sm text-gray-500">Ask Me Anything!</span>
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
            className="absolute bottom-full left-0 w-full rounded-2xl p-4 shadow-xl border border-gray-200 bg-white flex flex-col mb-2"
            style={{ maxHeight: "70vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
              <h2 className="text-base font-medium text-gray-700">
                Ask Clinico AI
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                onClick={() => setIsChatOpen(false)}
              >
                ✕
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-3 space-y-3 pr-1">
              {messages.map((message, idx) => {
                const isLastAssistant =
                  message.role === "assistant" && idx === messages.length - 1;
                return (
                  <div key={message.id} className="flex flex-col items-start">
                    <div
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end w-full"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>

                    {/* Show regenerate under last assistant msg */}
                    {isLastAssistant && !isLoading && (
                      <Button
                        onClick={handleRegenerate}
                        size="sm"
                        variant="ghost"
                        className="mt-1 flex items-center gap-1 text-gray-500 hover:text-indigo-600"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Regenerate Response
                      </Button>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl">
                    <video
                      src="/ai_thinking.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-16 w-auto"
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 h-8 w-8 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white"
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
    </div>
  );
}
