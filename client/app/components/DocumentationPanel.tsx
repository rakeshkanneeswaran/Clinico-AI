"use client";

import {
  useRef,
  useState,
  useEffect,
  Suspense,
  Dispatch,
  SetStateAction,
} from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Sparkles } from "lucide-react";

import { CautionComponent } from "./CautionComponent";
import { generateDocument, saveDocument, translate_document } from "./action";

// ============ Types ============
interface DocumentationPanelProps {
  generatedDoc: string;
  setGeneratedDoc: Dispatch<SetStateAction<string>>;
  setGenrating: Dispatch<SetStateAction<boolean>>;
  genrating: boolean;
  transcription: string;
}

// ============ Constants ============
const COLORS = {
  primary: "#3b82f6",
  badge: "#6366f1",
  iconBg: "#4f46e5",
};

// ============ Helper Components ============
const DocumentHeader = () => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: COLORS.iconBg }}
      >
        <FileText className="h-4 w-4 text-white" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Get Help with your problem
        </h2>
      </div>
    </div>
    <div className="flex gap-2">
      <Badge
        variant="outline"
        className="gap-1.5"
        style={{ borderColor: COLORS.badge, color: COLORS.badge }}
      >
        <Sparkles className="h-3 w-3" />
        AI Enhanced
      </Badge>
    </div>
  </div>
);

const DocumentDisplay = ({
  genrating,
  generatedDoc,
}: {
  genrating: boolean;
  generatedDoc: string;
}) => {
  let contentToRender: Record<string, any> = {};
  try {
    contentToRender = generatedDoc ? JSON.parse(generatedDoc) : {};
  } catch {
    contentToRender = { Document: generatedDoc };
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(contentToRender, null, 2)
      );
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy content");
    }
  };

  return (
    <div className="mb-6 relative">
      {genrating ? (
        <div className="flex flex-col items-center justify-center py-8">
          <video
            src="/ai_animation.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-40 h-40 mb-3"
          />
          <p className="text-muted-foreground text-sm">
            Generating document...
          </p>
        </div>
      ) : generatedDoc ? (
        <div
          className="p-4 leading-relaxed text-gray-800 whitespace-pre-wrap rounded-md border relative"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.badge}10)`,
            borderColor: `${COLORS.primary}20`,
          }}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="absolute top-2 right-2 text-xs px-2 py-1"
          >
            <img
              width="20"
              height="20"
              src="https://img.icons8.com/ios/50/copy--v1.png"
              alt="copy"
            />
          </Button>

          {Object.entries(contentToRender).map(([key, value]) => (
            <div key={key} className="mb-4">
              <span className="font-bold text-xl capitalize block mb-1">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <span className="text-gray-700">
                {typeof value === "string"
                  ? value
                  : JSON.stringify(value, null, 2)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-center py-8">
          No document generated yet.
        </div>
      )}
    </div>
  );
};

const ActionButtons = ({
  generatedDoc,
  onGenerateDocument,
  onDocumentSave,
  isSaving,
}: {
  generatedDoc: string;
  onGenerateDocument: () => void;
  onDocumentSave: () => void;
  isSaving: boolean;
}) => (
  <div className="flex gap-3 justify-end">
    <Button
      variant="outline"
      onClick={onGenerateDocument}
      disabled={isSaving}
      className="gap-2"
    >
      <Sparkles className="h-4 w-4" />
      Get Help
    </Button>
  </div>
);

// ============ Main Component ============
export function DocumentationPanel({
  generatedDoc,
  setGeneratedDoc,
  setGenrating,
  genrating,
  transcription,
}: DocumentationPanelProps) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const [showCaution, setShowCaution] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New states for translation
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Hindi");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/success.mp3");
    audioRef.current.volume = 0.3;
    errorAudioRef.current = new Audio("/sounds/error.mp3");
    errorAudioRef.current.volume = 0.3;
    return () => {
      [audioRef.current, errorAudioRef.current].forEach((audio) =>
        audio?.pause()
      );
    };
  }, []);

  const onGenerateDocument = async () => {
    if (!sessionId) return;
    setGenrating(true);

    try {
      const response = await generateDocument({
        transcript: transcription,
        userTemplateId: "soap-note-default", // hardcoded template ID
        sessionId,
        doctor_suggestions: "",
      });

      if (response.status === "error") {
        errorAudioRef.current?.play();
        setShowCaution(true);
        setGenrating(false);
        return;
      }
      console.log("Generated Document:", response.data.generated_document);
      setGeneratedDoc(JSON.stringify(response.data.generated_document));
      audioRef.current?.play().catch(() => {});
    } catch (error) {
      console.error("Failed to generate document:", error);
      errorAudioRef.current?.play();
      setShowCaution(true);
    } finally {
      setGenrating(false);
    }
  };

  const onDocumentSave = async () => {
    if (!sessionId || !generatedDoc) return;
    setIsSaving(true);

    try {
      const result = await saveDocument({
        sessionId,
        sessionDocumentId: "soap-note-default",
        content: generatedDoc,
        userTemplateId: "soap-note-default",
      });

      alert(result ? "Document saved successfully" : "Failed to save document");
    } catch (error) {
      console.error("Failed to save document:", error);
      alert("Failed to save document");
    } finally {
      setIsSaving(false);
    }
  };

  // ===== Translation handler =====
  const handleTranslate = async () => {
    if (!generatedDoc) {
      alert("Generate a document first before translating.");
      return;
    }

    let jsonObject: any;
    try {
      jsonObject = JSON.parse(generatedDoc);
    } catch {
      // If generatedDoc isn't JSON, send as string under a single field
      jsonObject = { Document: generatedDoc };
    }

    setIsTranslating(true);
    try {
      const response = await translate_document({
        json_object: jsonObject,
        target_language: selectedLanguage,
      });

      const translated = response.generated_document;
      // Ensure we store stringified JSON for UI
      const translatedString =
        typeof translated === "string"
          ? translated
          : JSON.stringify(translated);

      console.log("Translated Document:", translatedString);

      setGeneratedDoc(translatedString);
    } catch (err: any) {
      console.error("Translation error:", err);
      alert("Failed to translate document: " + (err?.message || err));
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative bg-gradient-card rounded-xl p-6 shadow-lg border border-[#e2e8f0] backdrop-blur-sm">
        {/* Upper-right translation controls (absolute so it sits top-right) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-sm p-2 border rounded-md bg-white"
            aria-label="Select language"
            disabled={!generatedDoc || isTranslating}
          >
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Kannada</option>
            <option>Telugu</option>
            <option>Malayalam</option>
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>

          <Button
            onClick={handleTranslate}
            disabled={!generatedDoc || isTranslating}
            className="gap-2"
            variant="outline"
          >
            {isTranslating ? "Translating..." : "Translate"}
          </Button>
        </div>

        <DocumentHeader />

        <DocumentDisplay genrating={genrating} generatedDoc={generatedDoc} />
        <ActionButtons
          generatedDoc={generatedDoc}
          onGenerateDocument={onGenerateDocument}
          onDocumentSave={onDocumentSave}
          isSaving={isSaving}
        />

        <div className="mt-8 flex justify-center">
          <Button
            onClick={() =>
              alert(
                "🚨 Nearby NGO and the Police station have been informed. They will reach out to you shortly."
              )
            }
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
          >
            🚨 Elevate Issue
          </Button>
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
