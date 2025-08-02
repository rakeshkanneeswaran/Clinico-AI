import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, MoreVertical, Clock, Globe } from "lucide-react";

interface MedicalHeaderProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  recordingTime?: string;
}

export function MedicalHeader({
  isRecording,
  onToggleRecording,
  recordingTime = "00:45",
}: MedicalHeaderProps) {
  // Color variables (customize these hex codes as needed)
  const colors = {
    primary: "#3b82f6", // Blue-500
    secondary: "#000000", // Black
    accent: "#10b981", // Emerald-500
    danger: "#ef4444", // Red-500 (recording)
    badge: "#6366f1", // Indigo-500
    recordingBg: "#fef2f2", // Red-50 (recording background)
  };

  return (
    <div
      className="border-b p-6 backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`,
        borderColor: `${colors.primary}20`,
      }}
    >
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2
            className="text-2xl font-bold"
            style={{ color: colors.secondary }}
          >
            Patient Documentation
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <Badge
              variant="outline"
              className="gap-1.5"
              style={{
                color: colors.badge,
                borderColor: `${colors.badge}20`,
              }}
            >
              <Globe className="h-3 w-3" />
              English
            </Badge>
            <Badge
              variant="outline"
              className="gap-1.5"
              style={{
                color: colors.badge,
                borderColor: `${colors.badge}20`,
              }}
            >
              <Clock className="h-3 w-3" />
              14 days retention
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              isRecording ? "border" : "bg-muted"
            }`}
            style={{
              backgroundColor: isRecording ? colors.recordingBg : undefined,
              color: isRecording ? colors.danger : undefined,
              borderColor: isRecording ? `${colors.danger}20` : undefined,
            }}
          >
            {isRecording ? (
              <>
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: colors.danger }}
                />
                <span className="font-mono text-sm">{recordingTime}</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                <span className="text-sm">Ready to record</span>
              </>
            )}
          </div>

          <Button
            onClick={onToggleRecording}
            size="icon"
            className="rounded-full"
            style={{
              backgroundColor: isRecording ? colors.danger : colors.primary,
              color: "white",
            }}
          >
            {isRecording ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            style={{ color: colors.primary }}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
