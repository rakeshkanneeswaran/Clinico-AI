"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { createPatient, getPatientBySession } from "./action";

export function PatientForm({ onSuccess }: { onSuccess?: () => void }) {
  const searchParams = useSearchParams();
  const session = searchParams.get("session");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    bloodType: "",
  });

  const colors = {
    primary: "#3b82f6",
    accent: "#10b981",
    badge: "#6366f1",
  };

  useEffect(() => {
    if (session) {
      getPatientBySession(session).then((patient) => {
        if (patient) {
          setFormData({
            name: patient.name || "",
            age: patient.age || "",
            gender: patient.gender || "",
            weight: patient.weight || "",
            height: patient.height || "",
            bloodType: patient.bloodType || "",
          });
        }
      });
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsSaving(true);
    try {
      const patientId = await createPatient({
        sessionId: session,
        ...formData,
      });
      console.log("Patient created with ID:", patientId);
    } catch (error) {
      console.error("Error saving patient details:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="bg-gradient-card rounded-xl p-6 shadow-lg border border-border/50 backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.badge }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Patient Details
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter patient medical information
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-muted-foreground">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Patient name"
              className="bg-background/50 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age" className="text-muted-foreground">
              Age
            </Label>
            <Input
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className="bg-background/50 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-muted-foreground">
              Gender
            </Label>
            <Input
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Gender"
              className="bg-background/50 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-muted-foreground">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Weight"
              className="bg-background/50 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height" className="text-muted-foreground">
              Height (cm)
            </Label>
            <Input
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Height"
              className="bg-background/50 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodType" className="text-muted-foreground">
              Blood Type
            </Label>
            <Input
              id="bloodType"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              placeholder="Blood Type"
              className="bg-background/50 border-border/50"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            style={{ backgroundColor: colors.accent }}
            className="gap-2 hover:opacity-90"
          >
            {isSaving ? "Saving..." : "Save Patient Details"}
          </Button>
        </div>
      </form>
    </div>
  );
}
