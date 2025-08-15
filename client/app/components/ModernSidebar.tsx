"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createSession } from "./action";
import {
  FileText,
  BookOpen,
  Users,
  Settings,
  Plus,
  LayoutDashboard,
  Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function ModernSidebar() {
  const router = useRouter();

  // Color variables
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

  const generalItems = [
    { icon: LayoutDashboard, label: "Dashboard", link: "/dashboard" },
    { icon: Bell, label: "Notifications", link: "/notifications" },
  ];

  const documentationItems = [
    {
      icon: BookOpen,
      label: "Templates Library",
      link: "/dashboard/template",
    },
    { icon: Users, label: "Community", link: "/community" },
    { icon: Users, label: "Team", link: "/team" },
    { icon: Settings, label: "Settings", link: "/settings" },
  ];

  const handleNewSession = async () => {
    try {
      const sessionId = await createSession();
      router.push(`/dashboard/session?session=${sessionId}`);
    } catch (error) {
      console.error("Error creating session:", error);
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
      {/* New Session Button at Top */}
      <Button
        size="lg"
        className="w-full gap-2 mb-6 hover:opacity-90 bg-black hover:bg-black/90"
        style={{
          color: "white",
        }}
        onClick={handleNewSession}
      >
        <Plus className="h-4 w-4" />
        New Session
      </Button>

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
              Clinico AI
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-6 flex-grow">
        {/* General */}
        <div>
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: colors.mutedText }}
          >
            General
          </h2>
          <div className="space-y-1">
            {generalItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                style={{
                  color: colors.activeText,
                }}
                className="w-full justify-start gap-3 h-auto p-3 text-left hover:bg-blue-50"
                onClick={() => router.push(item.link)}
              >
                <item.icon
                  className="h-4 w-4"
                  style={{ color: colors.mutedText }}
                />
                <span className="text-sm">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Documentation Tools */}
        <div>
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: colors.mutedText }}
          >
            Documentation Tools
          </h2>
          <div className="space-y-1">
            {documentationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                style={{
                  color: colors.activeText,
                }}
                className="w-full justify-start gap-3 h-auto p-3 text-left hover:bg-blue-50"
                onClick={() => router.push(item.link)}
              >
                <item.icon
                  className="h-4 w-4"
                  style={{ color: colors.mutedText }}
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
    </div>
  );
}
