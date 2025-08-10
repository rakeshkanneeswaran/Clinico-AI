"use client";

import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Sparkles, Copy, Share } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { saveDocument } from "./action";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { generateDocument } from "./action";
import { getDocumentBySession } from "./action";
import { CautionComponent } from "./CautionComponent";
import { Suspense } from "react";

interface DocumentationPanelProps {
  generatedDoc: string;
  setGeneratedDoc: Dispatch<SetStateAction<string>>;
  setGenrating: Dispatch<SetStateAction<boolean>>;
  genrating: boolean;
  transcription: string;
}

export function DocumentationPanel({
  generatedDoc,
  setGeneratedDoc,
  setGenrating,
  genrating,
  transcription,
}: DocumentationPanelProps) {
  // Color variables (customize these hex codes as needed)
  const colors = {
    primary: "#3b82f6", // Blue-500
    secondary: "#000000", // Black
    accent: "#10b981", // Emerald-500
    badge: "#6366f1", // Indigo-500
    iconBg: "#4f46e5", // Indigo-600
  };
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const session = searchParams.get("session");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(
    "soap"
  );
  const [activeTab, setActiveTab] = useState<
    "soap" | "referral" | "summary" | "dap"
  >("soap");

  const [showCaution, setShowCaution] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/success.mp3");
    audioRef.current.volume = 0.3; // Set appropriate volume (0.0 to 1.0)

    errorAudioRef.current = new Audio("/sounds/error.mp3");
    errorAudioRef.current.volume = 0.3;

    return () => {
      // Cleanup
      [audioRef.current, errorAudioRef.current].forEach((audio) => {
        if (audio) {
          audio.pause();
        }
      });
    };
  }, []);

  function renderValue(value: unknown) {
    if (typeof value === "object" && value !== null) {
      return (
        <ul className="pl-4 list-disc">
          {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
            <li key={k}>
              <strong>{k}:</strong> {renderValue(v)}
            </li>
          ))}
        </ul>
      );
    }
    return value as React.ReactNode;
  }

  const onGenerateDocument = () => {
    setGenrating(true);
    if (selectedDocument) {
      generateDocument({
        transcript: transcription || "",
        document_type: selectedDocument,
      })
        .then((response) => {
          if (response.status === "error") {
            errorAudioRef.current?.play();
            setShowCaution(true); // Show caution component instead of alert
            setGenrating(false);
            return;
          }
          setGeneratedDoc(response.data.generated_document);
          setGenrating(false);
          // Play success sound when document is generated
          if (audioRef.current) {
            audioRef.current.currentTime = 0; // Rewind to start
            audioRef.current
              .play()
              .catch((e) => console.log("Audio play failed:", e));
          }
        })
        .catch((error) => {
          console.error("Error generating document:", error);
        });
    }
  };

  const onDocumentSave = async () => {
    if (!session) {
      console.error("User ID, generated document, or session ID is missing");
      return;
    }
    setIsSaving(true);
    const result = await saveDocument({
      documentType: activeTab,
      content: generatedDoc,
      sessionId: session as string,
    });

    if (result) {
      alert("Document saved successfully");
      // Optionally, you can show a success message or update the UI
    } else {
      alert("Failed to save document");
    }
    setIsSaving(false);
  };

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      if (session && activeTab) {
        const doc = await getDocumentBySession({
          sessionId: session,
          documentType: activeTab,
        });
        if (doc) {
          setGeneratedDoc(JSON.parse(doc));
        } else {
          setGeneratedDoc("");
        }
      }
    };
    fetchDocument();
  }, [session, activeTab, setGeneratedDoc]);

  const tabs = [
    {
      id: "soap" as const,
      label: "SOAP Notes",
      description: "Structured medical notes",
    },
    {
      id: "referral" as const,
      label: "Referral",
      description: "Patient referral document",
    },
    {
      id: "summary" as const,
      label: "Summary",
      description: "Clinical summary",
    },
    {
      id: "dap" as const,
      label: "DAP Notes",
      description: "Data, Assessment, Plan notes",
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-gradient-card rounded-xl p-6 shadow-lg border border-[#e2e8f0] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.iconBg }}
            >
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Generated Documentation
              </h2>
              <p className="text-xs text-muted-foreground">
                AI-powered medical documentation
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="gap-1.5"
            style={{ borderColor: colors.badge, color: colors.badge }}
          >
            <Sparkles className="h-3 w-3" />
            AI Enhanced
          </Badge>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedDocument(tab.id);
              }}
              className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-lg shadow-[#8db2df]"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <div className="text-center">
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs text-muted-foreground">
                  {tab.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Document Display */}
        <div className="relative mb-6">
          <div className="h-80 overflow-y-auto bg-background/50 border border-border/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap text-foreground">
            {genrating ? (
              <div className="h-full flex flex-col items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className=" object-contain"
                >
                  <source src="/loading.webm" type="video/webm" />
                  {/* Fallback text if video doesn't load */}
                  Generating document...
                </video>
                <p className="mt-4 text-muted-foreground">
                  AI is generating your {activeTab.toUpperCase()} document...
                </p>
              </div>
            ) : generatedDoc ? (
              Object.entries(generatedDoc).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <h3 className="text-base font-semibold capitalize text-primary mb-1">
                    {key}
                  </h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {renderValue(value)}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No document generated yet
              </div>
            )}
          </div>

          {/* Keep the copy button but only show when not generating and has content */}
          {!genrating && generatedDoc && (
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                style={{ color: colors.primary }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setGeneratedDoc(
                  `Generated ${activeTab.toUpperCase()} Document ............`
                );
                onGenerateDocument();
              }}
              style={{
                color: "white",
              }}
              className="gap-2 hover:opacity-90 bg-black hover:bg-black/90 text-white font-bold"
            >
              <Sparkles className="h-4 w-4" />
              Generate {activeTab.toUpperCase()}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={async () => {
                setIsSaving(true);
                onDocumentSave();
              }}
              style={{
                color: "white",
              }}
              className="gap-2 hover:opacity-90 bg-black hover:bg-black/90 text-white font-bold"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!generatedDoc}
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!generatedDoc}
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        {showCaution && (
          <CautionComponent
            onCancel={() => {
              setShowCaution(false);
              setGenrating(false);
            }}
          />
        )}
      </div>
    </Suspense>
  );
}
