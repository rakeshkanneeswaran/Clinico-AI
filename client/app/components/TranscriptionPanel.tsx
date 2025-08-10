"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Volume2, Waves, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveTranscript } from "./action";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";

interface TranscriptionPanelProps {
  transcription: string;
  onTranscriptionChange: (value: string) => void;
  isRecording?: boolean;
  onDeepAnalysis?: () => void; // Add this prop
  isAnalyzing?: boolean; // Add this prop
}

export function TranscriptionPanel({
  transcription,
  onTranscriptionChange,
  isRecording = false,
  onDeepAnalysis,
  isAnalyzing = false,
}: TranscriptionPanelProps) {
  const colors = {
    primary: "#3b82f6",
    secondary: "#000000",
    accent: "#10b981",
    badge: "#6366f1",
    iconBg: "#4f46e5",
    danger: "#ef4444",
  };

  const sampleTranscription = `Doctor: How are you feeling today?
Patient: My stomach hurts badly, doctor. I've been vomiting blood.
Doctor: I see. Any other symptoms?
Patient: Yes, black stools and dizziness.`;

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveTranscript(sessionId!, transcription);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-gradient-card rounded-xl p-6 shadow-lg border border-[#e2e8f0] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.iconBg }}
            >
              <ArrowRightLeft className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Transcription
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {isRecording && (
              <Badge
                variant="outline"
                className="gap-1.5"
                style={{
                  color: colors.danger,
                  borderColor: `${colors.danger}20`,
                }}
              >
                <Waves className="h-3 w-3" />
                Recording
              </Badge>
            )}
            <Badge
              variant="outline"
              className="gap-1.5"
              style={{
                color: colors.badge,
                borderColor: `${colors.badge}20`,
              }}
            >
              <Volume2 className="h-3 w-3" />
              Auto-detect
            </Badge>
          </div>
        </div>

        <div className="relative">
          <Textarea
            value={transcription || sampleTranscription}
            onChange={(e) => onTranscriptionChange(e.target.value)}
            className="h-117 resize-none font-mono text-sm bg-background/50 border-border/50 focus:ring-2 transition-all duration-300"
            style={{
              borderColor: `${colors.primary}50`,
            }}
            placeholder="Patient conversation will appear here automatically..."
          />

          {isRecording && (
            <div className="absolute bottom-4 right-4">
              <div
                className="flex items-center gap-2 text-xs bg-background/80 px-2 py-1 rounded-md backdrop-blur-sm"
                style={{ color: colors.danger }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: colors.danger }}
                />
                <span>Listening...</span>
              </div>
            </div>
          )}
        </div>

        {/* Save button with animation */}
        <div className="mt-4 flex justify-between">
          <Button
            onClick={handleSave}
            style={{
              color: "white",
            }}
            className="gap-2 hover:opacity-90 bg-black hover:bg-black/90 text-white font-bold"
            disabled={!transcription || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Transcript
              </>
            )}
          </Button>
          <Button
            onClick={onDeepAnalysis}
            variant="outline"
            className="gap-2 border-primary text-primary hover:bg-primary/10"
            disabled={!transcription || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Deep Analysis
              </>
            )}
          </Button>
        </div>
      </div>
    </Suspense>
  );
}
