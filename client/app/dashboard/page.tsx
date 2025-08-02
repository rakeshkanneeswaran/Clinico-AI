"use client";
import { useState } from "react";
import { ModernSidebar } from "@/components/ModernSidebar";
import { MedicalHeader } from "@/components/MedicalHeader";
import { TranscriptionPanel } from "@/components/TranscriptionPanel";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { AIAssistant } from "@/components/AIAssistant";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"soap" | "referral" | "summary">(
    "soap"
  );
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const sampleSOAP = `Subjective:
- Reports severe abdominal pain
- Vomiting blood x 2 days
- Black stools
- Dizziness and lightheadedness

Objective:
- Pale complexion
- Tachycardia (HR 110)
- Hypotension (90/60)
- Abdominal tenderness on palpation

Assessment:
- Suspected upper GI bleed
- Rule out gastric ulcer vs varices

Plan:
- CBC, LFTs, coagulation panel
- Urgent endoscopy
- IV fluids and PPI
- Counsel on alcohol cessation`;

  const handleGenerate = () => {
    setGeneratedDoc(
      activeTab === "soap"
        ? sampleSOAP
        : activeTab === "referral"
        ? "Referral Letter\n\nDear Colleague,\n\nI am referring this patient for urgent gastroenterological evaluation for suspected upper GI bleeding.\n\nThank you for your prompt attention.\n\nBest regards,\nDr. Smith"
        : "Clinical Summary\n\nPatient presents with acute upper GI bleeding requiring immediate intervention. Hemodynamically stable but requires monitoring and endoscopic evaluation."
    );
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <ModernSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <MedicalHeader
            isRecording={isRecording}
            onToggleRecording={toggleRecording}
          />

          {/* Documentation Area */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transcription Panel */}
                <TranscriptionPanel
                  transcription={transcription}
                  onTranscriptionChange={setTranscription}
                  isRecording={isRecording}
                />
                {/* Documentation Panel */}

                <DocumentationPanel
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  generatedDoc={generatedDoc}
                  onGenerate={handleGenerate}
                />
              </div>
            </div>
          </div>

          {/* AI Assistant */}
          <AIAssistant
            showPanel={showAIPanel}
            onTogglePanel={() => setShowAIPanel(!showAIPanel)}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
