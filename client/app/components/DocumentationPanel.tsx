import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Sparkles, Copy, Share } from "lucide-react";

interface DocumentationPanelProps {
  activeTab: "soap" | "referral" | "summary";
  onTabChange: (tab: "soap" | "referral" | "summary") => void;
  generatedDoc: string;
  onGenerate: () => void;
}

export function DocumentationPanel({
  activeTab,
  onTabChange,
  generatedDoc,
  onGenerate,
}: DocumentationPanelProps) {
  // Color variables (customize these hex codes as needed)
  const colors = {
    primary: "#3b82f6", // Blue-500
    secondary: "#000000", // Black
    accent: "#10b981", // Emerald-500
    badge: "#6366f1", // Indigo-500
    iconBg: "#4f46e5", // Indigo-600
  };

  const tabs = [
    {
      id: "soap" as const,
      label: "SOAP Notes",
      description: "Structured medical notes",
    },
    {
      id: "referral" as const,
      label: "Referral",
      description: "Patient referral document",
    },
    {
      id: "summary" as const,
      label: "Summary",
      description: "Clinical summary",
    },
  ];

  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-lg border border-border/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.iconBg }}
          >
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Generated Documentation
            </h2>
            <p className="text-xs text-muted-foreground">
              AI-powered medical documentation
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className="gap-1.5"
          style={{ borderColor: colors.badge, color: colors.badge }}
        >
          <Sparkles className="h-3 w-3" />
          AI Enhanced
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <div className="text-center">
              <div className="font-medium">{tab.label}</div>
              <div className="text-xs text-muted-foreground">
                {tab.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Document Display */}
      <div className="relative mb-6">
        <div className="h-80 overflow-y-auto bg-background/50 border border-border/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap text-foreground">
          {generatedDoc || (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p>
                  Click &apos;Generate&apos; to create a {activeTab} document
                  using AI
                </p>
                <p className="text-xs mt-1">
                  Documentation will appear here automatically
                </p>
              </div>
            </div>
          )}
        </div>

        {generatedDoc && (
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              style={{ color: colors.primary }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between gap-3">
        <div className="flex gap-2">
          <Button
            onClick={onGenerate}
            style={{
              backgroundColor: colors.accent,
              color: "white",
            }}
            className="gap-2 hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            Generate {activeTab.toUpperCase()}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={!generatedDoc}
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={!generatedDoc}
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
