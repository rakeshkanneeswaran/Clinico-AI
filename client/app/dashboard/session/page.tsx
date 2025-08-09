"use client";
import { useState } from "react";
import { MedicalHeader } from "@/components/MedicalHeader";
import { TranscriptionPanel } from "@/components/TranscriptionPanel";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { Suspense } from "react";
import { AIChatComponent } from "@/components/ChatComponent";

const Index = () => {
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [genrating, setGenrating] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen w-full bg-[#f9fbfc] relative">
        <div className="relative z-10">
          <div className="flex">
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
              <div className="flex-1 p-6 flex-col overflow-auto">
                <div className="max-w-7xl mx-auto">
                  {/* Container for both rows */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Row - Transcription and Documentation */}
                    <div className="col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <TranscriptionPanel
                        transcription={transcription}
                        onTranscriptionChange={setTranscription}
                        isRecording={isRecording}
                      />
                      <DocumentationPanel
                        generatedDoc={generatedDoc}
                        setGeneratedDoc={setGeneratedDoc}
                        setGenrating={setGenrating}
                        genrating={genrating}
                        transcription={transcription}
                      />
                    </div>

                    {/* Bottom Row - AI Chat (spans same width as panels above) */}
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
