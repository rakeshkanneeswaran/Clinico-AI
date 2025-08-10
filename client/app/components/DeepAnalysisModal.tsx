// components/DeepAnalysisModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Helper function to clean and split comma-separated strings
const parseListString = (input: string | string[] | undefined): string[] => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return input
    .split(",")
    .map((item) => item.trim().replace(/\.$/, "")) // Remove trailing periods
    .filter((item) => item.length > 0);
};

export function DeepAnalysisModal({
  analysis,
  onClose,
}: {
  analysis: {
    patient_complaints: string;
    clinical_findings: string;
    primary_diagnosis: string;
    differential_diagnoses: string;
    red_flags: string;
    treatment_plan: string;
    lifestyle_recommendations: string;
    follow_up_actions: string;
    communication_quality: string;
    patient_understanding: string;
    missed_questions: string;
    ethical_legal_notes: string;
    contextual_factors: string;
  };
  onClose: () => void;
}) {
  // Parse all list-type fields
  const differentialDiagnoses = parseListString(
    analysis.differential_diagnoses
  );
  const redFlags = parseListString(analysis.red_flags);
  const contextualFactors = parseListString(analysis.contextual_factors);
  const missedQuestions = parseListString(analysis.missed_questions);

  return (
    <div className="fixed inset-0 z-50  backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Clinical Deep Analysis</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Presentation Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Patient Presentation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-primary">Chief Complaint</h4>
                <p className="text-sm bg-muted/50 p-3 rounded">
                  {analysis.patient_complaints}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-primary">Clinical Findings</h4>
                <p className="text-sm bg-muted/50 p-3 rounded">
                  {analysis.clinical_findings}
                </p>
              </div>
            </div>
          </div>

          {/* Diagnosis Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Diagnostic Assessment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-primary">Primary Diagnosis</h4>
                <p className="text-sm bg-muted/50 p-3 rounded">
                  {analysis.primary_diagnosis}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-primary">
                  Differential Diagnoses
                </h4>
                <div className="text-sm bg-muted/50 p-3 rounded">
                  {differentialDiagnoses.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {differentialDiagnoses.map((dx, i) => (
                        <li key={i}>{dx}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>None specified</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-primary">Red Flags</h4>
                <div className="text-sm bg-muted/50 p-3 rounded">
                  {redFlags.some(
                    (flag) => flag.toLowerCase() !== "none noted"
                  ) ? (
                    <ul className="list-disc pl-5">
                      {redFlags.map((flag, i) => (
                        <li key={i}>{flag}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>None noted</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Plan Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Treatment Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-primary">
                  Recommended Treatment
                </h4>
                <p className="text-sm bg-muted/50 p-3 rounded">
                  {analysis.treatment_plan}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-primary">
                  Lifestyle Recommendations
                </h4>
                <p className="text-sm bg-muted/50 p-3 rounded">
                  {analysis.lifestyle_recommendations}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-primary">Follow-up Plan</h4>
                <p className="text-sm bg-muted/50 p-3 rounded">
                  {analysis.follow_up_actions}
                </p>
              </div>
            </div>
          </div>

          {/* Contextual Factors Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Contextual Factors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-primary">
                  Environmental/Social Context
                </h4>
                <div className="text-sm bg-muted/50 p-3 rounded">
                  {contextualFactors.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {contextualFactors.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>None noted</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-primary">
                  Communication Quality
                </h4>
                <p className="text-sm bg-muted/50 p-3 rounded">
                  {analysis.communication_quality}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-primary">
                  Patient Understanding
                </h4>
                <p className="text-sm bg-muted/50 p-3 rounded">
                  {analysis.patient_understanding}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-primary">Potential Gaps</h4>
                <div className="text-sm bg-muted/50 p-3 rounded">
                  {missedQuestions.some(
                    (q) => !q.toLowerCase().includes("no inquiry")
                  ) ? (
                    <ul className="list-disc pl-5">
                      {missedQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No significant gaps noted</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
          <Button onClick={onClose}>Close Analysis</Button>
        </div>
      </div>
    </div>
  );
}
