"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CalendarDays, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSessions } from "./action";

export default function DashboardPage() {
  const colors = {
    primary: "#3b82f6",
    secondary: "#000000",
    accent: "#10b981",
    badge: "#6366f1",
    iconBg: "#4f46e5",
  };

  const [sessions, setSessions] = useState<
    {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      patient: {
        id: string;
        name: string;
        age: string;
        weight: string;
        height: string;
        bloodType: string;
        gender: string;
      } | null;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    getSessions(userId)
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
        setLoading(false);
      });
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" style={{ color: colors.secondary }}>
          Patient Sessions
        </h1>
        <Button
          style={{ backgroundColor: colors.accent }}
          className="gap-2 hover:opacity-90"
        >
          <FileText className="h-4 w-4" />
          New Session
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sessions found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-gradient-card rounded-xl p-6 shadow-lg border border-border/50 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`,
              }}
              onClick={() =>
                router.push(`/dashboard/session?session=${session.id}`)
              }
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.iconBg }}
                  >
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {session.patient?.name || "Unnamed Patient"}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>{formatDate(session.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  style={{ borderColor: colors.badge, color: colors.badge }}
                >
                  Session
                </Badge>
              </div>

              {session.patient && (
                <div className="space-y-3 mt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Age</p>
                      <p className="text-sm font-medium">
                        {session.patient.age || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="text-sm font-medium">
                        {session.patient.gender || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="text-sm font-medium">
                        {session.patient.weight || "N/A"} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Height</p>
                      <p className="text-sm font-medium">
                        {session.patient.height || "N/A"} cm
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Blood Type</p>
                    <p className="text-sm font-medium">
                      {session.patient.bloodType || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  style={{ color: colors.primary }}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    router.push(`/dashboard/session?session=${session.id}`);
                  }}
                >
                  View Session
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
