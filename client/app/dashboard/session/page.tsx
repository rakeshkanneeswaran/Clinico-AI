"use client";
import { useEffect, useState } from "react";
import { ModernSidebar } from "@/components/ModernSidebar";
import { MedicalHeader } from "@/components/MedicalHeader";
import { TranscriptionPanel } from "@/components/TranscriptionPanel";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { AIAssistant } from "@/components/AIAssistant";
import { generateDocument } from "./action";

const Index = () => {
  const [activeTab, setActiveTab] = useState<
    "soap" | "referral" | "summary" | "dap"
  >("soap");
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [genrating, setGenrating] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  useEffect(() => {
    console.log(selectedDocument);
    if (selectedDocument) {
      generateDocument({
        transcript: transcription,
        document_type: selectedDocument,
      })
        .then((doc) => {
          setGeneratedDoc(doc);
          setGenrating(false);
        })
        .catch((error) => {
          console.error("Error generating document:", error);
        });
    }
  }, [selectedDocument]);

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
            onClose={() => setIsRecording(false)}
            setTranscription={setTranscription}
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
                  setSelectedDocument={setSelectedDocument}
                  setGeneratedDoc={setGeneratedDoc}
                  setGenrating={setGenrating}
                  genrating={genrating}
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
