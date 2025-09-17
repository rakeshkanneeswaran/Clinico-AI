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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Download, Sparkles, Plus } from "lucide-react";

import { CautionComponent } from "./CautionComponent";
import TemplateForm from "./TemplateForm";
import {
  generateDocument,
  saveDocument,
  getSessionDocumentById,
  getAllUserTemplates,
} from "./action";

// ============ Types ============
interface DocumentationPanelProps {
  generatedDoc: string;
  setGeneratedDoc: Dispatch<SetStateAction<string>>;
  setGenrating: Dispatch<SetStateAction<boolean>>;
  genrating: boolean;
  transcription: string;
}

interface UserTemplate {
  id: string;
  template: {
    id: string;
    name: string;
    description: string;
  };
}

interface SessionDocument {
  id: string;
  content: string;
  userTemplateId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ Constants ============
const COLORS = {
  primary: "#3b82f6",
  badge: "#6366f1",
  iconBg: "#4f46e5",
};

// ============ Helper Components ============
const DocumentHeader = ({ onOpenModal }: { onOpenModal: () => void }) => (
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
          Generated Documentation
        </h2>
        <p className="text-xs text-muted-foreground">
          AI-powered medical documentation
        </p>
      </div>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" className="gap-2" onClick={onOpenModal}>
        <Plus className="h-4 w-4" />
        Create / Select Template
      </Button>
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

export function TemplateModal({
  isOpen,
  onClose,
  templates,
  setCurrentTemplate,
}: {
  isOpen: boolean;
  onClose: () => void;
  templates: UserTemplate[];
  setCurrentTemplate: (tpl: UserTemplate) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl min-h-[80vh] backdrop-blur-md">
        {!showForm ? (
          <>
            <DialogHeader>
              <DialogTitle>Select or Create Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {templates.length > 0 ? (
                templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => {
                      setCurrentTemplate(tpl);
                      onClose();
                    }}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-[#ecf5fa]"
                  >
                    <div className="font-medium">{tpl.template.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {tpl.template.description}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No templates available.</p>
              )}
            </div>
            <div className="pt-4 flex justify-end">
              <Button onClick={() => setShowForm(true)}>
                Create New Template
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <TemplateForm />
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Back to Templates
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// DocumentDisplay component
// DocumentDisplay component
const DocumentDisplay = ({
  genrating,
  generatedDoc,
}: {
  genrating: boolean;
  generatedDoc: string;
}) => {
  let contentToRender: Record<string, string> = {};
  try {
    contentToRender = generatedDoc ? JSON.parse(generatedDoc) : {};
  } catch {
    contentToRender = { Document: generatedDoc };
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(contentToRender, null, 2) // nicely formatted JSON
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
          {/* Copy Button */}
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
              <span className="text-gray-700">{value as string}</span>
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

// ActionButtons component
const ActionButtons = ({
  currentTemplate,
  generatedDoc,
  onGenerateDocument,
  onDocumentSave,
  isSaving,
}: {
  currentTemplate: UserTemplate;
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
      Generate
    </Button>
    <Button
      onClick={onDocumentSave}
      disabled={!generatedDoc || isSaving}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      {isSaving ? "Saving..." : "Save"}
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
  const [templates, setTemplates] = useState<UserTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<UserTemplate>();
  const [showCaution, setShowCaution] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [doctorSuggestions, setDoctorSuggestions] = useState<string>(""); // NEW STATE

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

  useEffect(() => {
    console.log("Doctor's suggestions updated:", doctorSuggestions);
  }, [doctorSuggestions]);

  // Load user templates
  useEffect(() => {
    const fetchTemplates = async () => {
      if (sessionId) {
        try {
          const response = await getAllUserTemplates({ sessionId });
          setTemplates(response || []);
        } catch (error) {
          console.error("Failed to fetch templates:", error);
        }
      }
    };
    fetchTemplates();
  }, [sessionId]);

  // Fetch session document when template changes
  useEffect(() => {
    const fetchSessionDoc = async () => {
      if (sessionId && currentTemplate) {
        try {
          const doc = await getSessionDocumentById({
            sessionId,
            sessionDocumentId: currentTemplate.id,
          });
          setGeneratedDoc(doc?.content || "");
        } catch (error) {
          console.error("Failed to fetch session document:", error);
          setGeneratedDoc("");
        }
      }
    };
    fetchSessionDoc();
  }, [sessionId, currentTemplate, setGeneratedDoc]);

  const onGenerateDocument = async () => {
    if (!currentTemplate || !sessionId) return;
    setGenrating(true);

    try {
      const response = await generateDocument({
        transcript: transcription,
        userTemplateId: currentTemplate.id,
        sessionId,
        doctor_suggestions: doctorSuggestions || "",
      });

      if (response.status === "error") {
        errorAudioRef.current?.play();
        setShowCaution(true);
        setGenrating(false);
        return;
      }
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
    if (!sessionId || !currentTemplate || !generatedDoc) return;
    setIsSaving(true);

    try {
      const result = await saveDocument({
        sessionId,
        sessionDocumentId: currentTemplate.id,
        content: generatedDoc,
        userTemplateId: currentTemplate.id,
      });

      alert(result ? "Document saved successfully" : "Failed to save document");
    } catch (error) {
      console.error("Failed to save document:", error);
      alert("Failed to save document");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-gradient-card rounded-xl p-6 shadow-lg border border-[#e2e8f0] backdrop-blur-sm">
        <DocumentHeader onOpenModal={() => setIsModalOpen(true)} />

        {currentTemplate ? (
          <>
            <div className="mb-6 text-sm text-muted-foreground">
              Using template: <strong>{currentTemplate.template.name}</strong>
            </div>

            {/* Doctor Suggestions Input */}
            <div className="mb-6">
              <label className="block text-md font-bold mb-2 text-foreground">
                Provide suggestions to AI ? (optional)
              </label>
              <textarea
                value={doctorSuggestions}
                onChange={(e) => setDoctorSuggestions(e.target.value)}
                placeholder="Add any special notes, recommendations, or instructions for the AI..."
                className="w-full p-3 border rounded-lg text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={1200} // hard limit in characters
              />

              {/* Word Counter */}
              <div className="text-sm font-semibold text-foreground text-right mt-2 tracking-wide">
                <div
                  className={
                    doctorSuggestions.length >= 1200
                      ? "text-red-600 text-lg font-bold"
                      : "text-sm font-semibold"
                  }
                >
                  {doctorSuggestions.length}
                  <span className="text-gray-500"> / 1200 letters</span>
                </div>
              </div>
            </div>

            <DocumentDisplay
              genrating={genrating}
              generatedDoc={generatedDoc}
            />
            <ActionButtons
              currentTemplate={currentTemplate}
              generatedDoc={generatedDoc}
              onGenerateDocument={onGenerateDocument}
              onDocumentSave={onDocumentSave}
              isSaving={isSaving}
            />
          </>
        ) : null}

        {showCaution && (
          <CautionComponent
            onCancel={() => {
              setShowCaution(false);
              setGenrating(false);
            }}
          />
        )}

        <TemplateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          templates={templates}
          setCurrentTemplate={setCurrentTemplate}
        />
      </div>
    </Suspense>
  );
}
