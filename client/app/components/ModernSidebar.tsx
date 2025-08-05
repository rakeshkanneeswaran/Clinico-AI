import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createSession } from "./action";
import {
  FileText,
  BookOpen,
  Users,
  Settings,
  Plus,
  User,
  Clock,
} from "lucide-react";

export function ModernSidebar() {
  // Color variables (customize these hex codes as needed)
  const colors = {
    primary: "#3b82f6", // Blue-500
    secondary: "#000000", // Black
    accent: "#10b981", // Emerald-500
    badge: "#6366f1", // Indigo-500
    iconBg: "#4f46e5", // Indigo-600
    sidebarBg: "#f8fafc", // Slate-50
    patientCardBg: "#eff6ff", // Blue-50
    separator: "#e2e8f0", // Slate-200
    activeText: "#1e293b", // Slate-800
    mutedText: "#64748b", // Slate-500
  };

  const navigationItems = [
    { icon: BookOpen, label: "Templates Library", active: false },
    { icon: Users, label: "Community", active: false },
    { icon: Users, label: "Team", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  const handleNewSession = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found in local storage");
      return;
    }
    try {
      const sessionId = await createSession({ userId });
      console.log("New session created with ID:", sessionId);
      window.location.href = `/dashboard/session?session=${sessionId}`;
    } catch (error) {
      console.error("Error creating session:", error);
      // Handle session creation error (e.g., show notification)
    }
  };

  return (
    <div
      className="w-80 p-6 flex flex-col backdrop-blur-sm"
      style={{
        backgroundColor: colors.sidebarBg,
        borderRight: `1px solid ${colors.separator}`,
      }}
    >
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.iconBg }}
          >
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: colors.activeText }}
            >
              ClinicScribe AI
            </h1>
            <p className="text-sm" style={{ color: colors.mutedText }}>
              Medical Documentation
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: colors.mutedText }}
        >
          <Clock className="h-3 w-3" />
          <span>Today 11:25 PM</span>
        </div>
      </div>

      {/* Current Patient */}
      <div className="mb-8">
        <h2
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: colors.mutedText }}
        >
          Current Patient
        </h2>
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: colors.patientCardBg,
            borderColor: `${colors.primary}20`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium" style={{ color: colors.activeText }}>
                Rakeah Kame...
              </h3>
              <p className="text-sm" style={{ color: colors.mutedText }}>
                Active Session
              </p>
            </div>
            <Badge
              variant="secondary"
              className="text-xs"
              style={{
                backgroundColor: colors.accent,
                color: "white",
              }}
            >
              Live
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-6 flex-grow">
        <div>
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: colors.mutedText }}
          >
            Documentation Tools
          </h2>
          <div className="space-y-1">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                style={{
                  color: colors.activeText,
                  backgroundColor: item.active
                    ? `${colors.primary}10`
                    : "transparent",
                }}
                // Add Tailwind hover:bg-blue-100 for hover effect
                className={`w-full justify-start gap-3 h-auto p-3 text-left ${
                  item.active ? "bg-blue-100" : ""
                } hover:bg-blue-50`}
              >
                <item.icon
                  className="h-4 w-4"
                  style={{
                    color: item.active ? colors.primary : colors.mutedText,
                  }}
                />
                <span className="text-sm">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Separator
        className="my-4"
        style={{ backgroundColor: colors.separator }}
      />

      {/* New Session Button */}
      <Button
        size="lg"
        className="w-full gap-2 bg-blue-500 hover:bg-blue-600 text-white"
        style={{
          backgroundColor: colors.primary,
          color: "white",
        }}
        onClick={handleNewSession}
      >
        <Plus className="h-4 w-4" />
        New Session
      </Button>
    </div>
  );
}
