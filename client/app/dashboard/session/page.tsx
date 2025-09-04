"use client";
import { useState } from "react";
import { MedicalHeader } from "@/components/MedicalHeader";
import { TranscriptionPanel } from "@/components/TranscriptionPanel";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { Suspense } from "react";
import { AIChatComponent } from "@/components/ChatComponent";
import { generateDocument } from "./action";
import { DeepAnalysisModal } from "@/components/DeepAnalysisModal";

const Index = () => {
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [genrating, setGenrating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [isDocPanelMinimized, setIsDocPanelMinimized] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const toggleDocPanel = () => {
    setIsDocPanelMinimized(!isDocPanelMinimized);
  };

  const handleDeepAnalysis = async () => {
    if (!transcription) return;

    setIsAnalyzing(true);
    try {
      const response = await generateDocument({
        transcript: transcription,
        document_type: "deep_analysis",
        custom: false,
        template_id: "default",
      });

      if (response.status === "success") {
        // Remove JSON.parse since the data is already an object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setDeepAnalysis(response.data.generated_document);
        setShowAnalysisModal(true);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // SVG Icons for the toggle button
  const ChevronLeftIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen w-full bg-[#f9fbfc] relative">
        {/* Deep Analysis Modal */}
        {showAnalysisModal && deepAnalysis && (
          <DeepAnalysisModal
            analysis={deepAnalysis}
            onClose={() => setShowAnalysisModal(false)}
          />
        )}

        <div className="relative z-10">
          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Header and other components remain the same */}
              <MedicalHeader
                isRecording={isRecording}
                onToggleRecording={toggleRecording}
                onClose={() => setIsRecording(false)}
                setTranscription={setTranscription}
              />

              {/* Documentation Area */}
              <div className="flex-1 p-6 flex-col overflow-auto">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Row - Transcription and Documentation */}
                    <div className="col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 relative">
                      {/* Minimize Button */}
                      <button
                        onClick={toggleDocPanel}
                        className="absolute right-0 top-2 z-20 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                        style={{
                          right: isDocPanelMinimized ? "0" : "50%",
                          transform: "translateX(50%)",
                          transition: "right 0.3s ease-in-out",
                        }}
                        aria-label={
                          isDocPanelMinimized
                            ? "Expand panel"
                            : "Minimize panel"
                        }
                      >
                        {isDocPanelMinimized ? (
                          <ChevronLeftIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </button>

                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isDocPanelMinimized
                            ? "lg:col-span-2"
                            : "lg:col-span-1"
                        }`}
                      >
                        <TranscriptionPanel
                          transcription={transcription}
                          onTranscriptionChange={setTranscription}
                          isRecording={isRecording}
                          onDeepAnalysis={handleDeepAnalysis}
                          isAnalyzing={isAnalyzing}
                        />
                      </div>

                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isDocPanelMinimized
                            ? "hidden"
                            : "lg:col-span-1 opacity-100"
                        }`}
                      >
                        <DocumentationPanel
                          generatedDoc={generatedDoc}
                          setGeneratedDoc={setGeneratedDoc}
                          setGenrating={setGenrating}
                          genrating={genrating}
                          transcription={transcription}
                        />
                      </div>
                    </div>

                    {/* Bottom Row - AI Chat */}
                    <div className="col-span-2">
                      <AIChatComponent />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Index;
