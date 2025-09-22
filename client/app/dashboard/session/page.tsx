"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TranscriptionPanel } from "@/components/TranscriptionPanel";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { SessionDocumentsPanel } from "@/components/SessionDocumentsPanel"; // 👈 new import
import { MedicalHeader } from "@/components/MedicalHeader";
// import { AIChatComponent } from "@/components/ChatComponent";
import { FileText, Mic, FolderOpen } from "lucide-react";

const UnifiedPanel = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") ?? "";

  const [activeTab, setActiveTab] = useState<"transcript" | "HelpPanel">(
    "transcript"
  );

  const [transcription, setTranscription] = useState("");
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [genrating, setGenrating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const toggleRecording = () => setIsRecording(!isRecording);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen w-full bg-[#f9fbfc] relative">
        {/* Header */}
        <MedicalHeader
          isRecording={isRecording}
          onToggleRecording={toggleRecording}
          onClose={() => setIsRecording(false)}
          setTranscription={setTranscription}
        />

        {/* Tab Navigation */}
        <div className="p-3  mx-auto">
          <div className="flex border-b border-gray-200 mb-6">
            {/* Transcript Tab */}
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                activeTab === "transcript"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-[#f0f4fc]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("transcript")}
            >
              <Mic className="h-4 w-4" />
              Transcript
            </button>

            {/* Documentation Tab */}
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                activeTab === "HelpPanel"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-[#f0f4fc]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("HelpPanel")}
            >
              <FileText className="h-4 w-4" />
              HelpPanel
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "transcript" && (
            <TranscriptionPanel
              transcription={transcription}
              onTranscriptionChange={setTranscription}
              isRecording={isRecording}
              onDeepAnalysis={() => setShowAnalysisModal(true)}
              isAnalyzing={isAnalyzing}
            />
          )}

          {activeTab === "HelpPanel" && (
            <DocumentationPanel
              generatedDoc={generatedDoc}
              setGeneratedDoc={setGeneratedDoc}
              setGenrating={setGenrating}
              genrating={genrating}
              transcription={transcription}
            />
          )}

          {/* {activeTab === "documents" && (
            <SessionDocumentsPanel sessionId={sessionId} />
          )} */}

          {/* Bottom AI Chat */}
          {/* <div className="mt-8">
            <AIChatComponent />
          </div> */}
        </div>
      </div>
    </Suspense>
  );
};

export default UnifiedPanel;
