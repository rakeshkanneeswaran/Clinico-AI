import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, Sparkles, Brain } from "lucide-react";

interface AIAssistantProps {
  showPanel: boolean;
  onTogglePanel: () => void;
}

export function AIAssistant({ showPanel, onTogglePanel }: AIAssistantProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setQuery("");
    }
  };

  if (!showPanel) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onTogglePanel}
          variant="medical"
          size="xl"
          className="rounded-full shadow-medical hover:scale-110 transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-t border-border/50 bg-gradient-card backdrop-blur-sm p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-medical rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Clinico AI Assistant
              </h3>
              <p className="text-sm text-muted-foreground">
                Ask anything about medical documentation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5">
              <Sparkles className="h-3 w-3" />
              GPT-4 Enhanced
            </Badge>
            <Button
              onClick={onTogglePanel}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about medical terminology, documentation standards, or get help with your notes..."
            className="flex-1 bg-background/50 border-border/50 focus:border-medical-blue/50 focus:ring-medical-blue/20"
          />
          <Button
            type="submit"
            variant="medical"
            size="icon"
            disabled={!query.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
          >
            How to write SOAP notes?
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
          >
            Medical abbreviations
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
          >
            Referral templates
          </Badge>
        </div>
      </div>
    </div>
  );
}
