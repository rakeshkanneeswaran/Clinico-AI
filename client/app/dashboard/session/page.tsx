"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TranscriptionPanel } from "@/components/TranscriptionPanel";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { SessionDocumentsPanel } from "@/components/SessionDocumentsPanel"; // 👈 new import
import { MedicalHeader } from "@/components/MedicalHeader";
import { AIChatComponent } from "@/components/ChatComponent";
import { DeepAnalysisModal } from "@/components/DeepAnalysisModal";
import { FileText, Mic, FolderOpen } from "lucide-react";

const UnifiedPanel = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") ?? "";

  const [activeTab, setActiveTab] = useState<
    "transcript" | "documentation" | "documents"
  >("transcript");

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
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex border-b border-gray-200 mb-6">
            {/* Transcript Tab */}
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                activeTab === "transcript"
                  ? "border-b-2 border-blue-600 text-blue-600"
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
                activeTab === "documentation"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("documentation")}
            >
              <FileText className="h-4 w-4" />
              Documentation
            </button>

            {/* Documents Tab */}
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                activeTab === "documents"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("documents")}
            >
              <FolderOpen className="h-4 w-4" />
              Documents
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

          {activeTab === "documentation" && (
            <DocumentationPanel
              generatedDoc={generatedDoc}
              setGeneratedDoc={setGeneratedDoc}
              setGenrating={setGenrating}
              genrating={genrating}
              transcription={transcription}
            />
          )}

          {activeTab === "documents" && (
            <SessionDocumentsPanel sessionId={sessionId} />
          )}

          {/* Bottom AI Chat */}
          <div className="mt-8">
            <AIChatComponent />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default UnifiedPanel;
