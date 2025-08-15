"use client";

import {
  useRef,
  useState,
  useEffect,
  Suspense,
  SetStateAction,
  Dispatch,
  use,
} from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Sparkles,
  Copy,
  Share,
  ChevronDown,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CautionComponent } from "./CautionComponent";
import {
  saveDocument,
  generateDocument,
  getDocumentBySession,
  getAllCustomDocumentBySession,
  getCustomDocumentByTemplateId,
} from "./action";

// ============ Types ============
interface DocumentationPanelProps {
  generatedDoc: string;
  setGeneratedDoc: Dispatch<SetStateAction<string>>;
  setGenrating: Dispatch<SetStateAction<boolean>>;
  genrating: boolean;
  transcription: string;
}

interface DocumentType {
  id: string;
  label: string;
  description: string;
  custom: boolean;
}

interface CustomDocumentField {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  FieldName: string;
  FieldDescription: string;
  customDocumentId: string | null;
}

interface CustomDocumentBase {
  id: string;
  UserId: string | null;
  DocumentName: string;
  Description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  custom: boolean;
  fields: CustomDocumentField[];
}

type CustomDocumentResponse = {
  success: boolean;
  customDocument: CustomDocumentBase[] | null;
} | null;

// ============ Constants ============
const COLORS = {
  primary: "#3b82f6",
  secondary: "#000000",
  accent: "#10b981",
  badge: "#6366f1",
  iconBg: "#4f46e5",
};

const HARDCODED_DOCUMENT_TYPES: DocumentType[] = [
  {
    id: "soap",
    label: "SOAP",
    description: "Structured medical notes",
    custom: false,
  },
  {
    id: "referral",
    label: "Referral",
    description: "Patient referral document",
    custom: false,
  },
  {
    id: "summary",
    label: "Summary",
    description: "Clinical summary",
    custom: false,
  },
  {
    id: "pie",
    label: "PIE",
    description: "Problem, Intervention, Evaluation notes",
    custom: false,
  },
  {
    id: "dap",
    label: "DAP",
    description: "Data, Assessment, Plan notes",
    custom: false,
  },
];

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
      style={{ borderColor: COLORS.badge, color: COLORS.badge }}
    >
      <Sparkles className="h-3 w-3" />
      AI Enhanced
    </Badge>
  </div>
);

const TemplateModeToggle = ({
  useCustomDocs,
  setUseCustomDocs,
}: {
  useCustomDocs: boolean;
  setUseCustomDocs: (value: boolean) => void;
}) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-sm text-muted-foreground">Standard</span>
    <Switch checked={useCustomDocs} onCheckedChange={setUseCustomDocs} />
    <span className="text-sm text-muted-foreground">Custom</span>
  </div>
);

const DocumentTypeSelector = ({
  documentTypes,
  currentDocumentType,
  setActiveTab,
  setSelectedDocument,
}: {
  documentTypes: DocumentType[];
  currentDocumentType?: DocumentType;
  setActiveTab: (tab: string) => void;
  setSelectedDocument: (doc: string) => void;
}) => (
  <div className="flex items-center gap-3 mb-6">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {currentDocumentType?.label || "Select Document Type"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white">
        {documentTypes.map((doc) => (
          <DropdownMenuItem
            key={doc.id}
            className="hover:bg-[#ecf5fa]"
            onClick={() => {
              setActiveTab(doc.id);
              setSelectedDocument(doc.id);
            }}
          >
            <div>
              <div className="font-medium">{doc.label}</div>
              <div className="text-xs text-muted-foreground">
                {doc.description}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
    {currentDocumentType && (
      <div className="text-sm text-muted-foreground">
        {currentDocumentType.description}
      </div>
    )}
  </div>
);

const DocumentDisplay = ({
  genrating,
  generatedDoc,
  renderValue,
}: {
  genrating: boolean;
  generatedDoc: string;
  renderValue: (value: unknown) => React.ReactNode;
}) => (
  <div className="relative mb-6">
    <div className="h-96 overflow-y-auto bg-background/50 border border-border/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap text-foreground">
      {genrating ? (
        <LoadingIndicator />
      ) : generatedDoc ? (
        <DocumentContent
          generatedDoc={generatedDoc}
          renderValue={renderValue}
        />
      ) : (
        <EmptyState />
      )}
    </div>
    {!genrating && generatedDoc && <CopyButton />}
  </div>
);

const LoadingIndicator = () => (
  <div className="h-full flex flex-col items-center justify-center">
    <video autoPlay loop muted playsInline className="object-contain">
      <source src="/loading.webm" type="video/webm" />
      Generating document...
    </video>
    <p className="mt-4 text-muted-foreground">
      AI is generating your document...
    </p>
  </div>
);

const DocumentContent = ({
  generatedDoc,
  renderValue,
}: {
  generatedDoc: string;
  renderValue: (value: unknown) => React.ReactNode;
}) => (
  <>
    {Object.entries(generatedDoc).map(([key, value]) => (
      <div key={key} className="mb-4">
        <h3 className="text-base font-bold capitalize text-primary mb-1">
          {key}
        </h3>
        <div className="text-sm text-muted-foreground whitespace-pre-wrap">
          {renderValue(value)}
        </div>
      </div>
    ))}
  </>
);

const EmptyState = () => (
  <div className="h-full flex items-center justify-center text-muted-foreground">
    No document generated yet
  </div>
);

const CopyButton = () => (
  <div className="absolute top-2 right-2">
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      style={{ color: COLORS.primary }}
    >
      <Copy className="h-3 w-3" />
    </Button>
  </div>
);

const ActionButtons = ({
  activeTab,
  generatedDoc,
  onGenerateDocument,
  onDocumentSave,
  isSaving,
}: {
  activeTab: string;
  generatedDoc: string;
  onGenerateDocument: () => void;
  onDocumentSave: () => void;
  isSaving: boolean;
}) => (
  <div className="flex flex-wrap justify-between gap-3">
    <Button
      onClick={onGenerateDocument}
      className="gap-2 hover:opacity-90 bg-black hover:bg-black/90 text-white font-bold"
    >
      <Sparkles className="h-4 w-4" />
      Generate {activeTab.toUpperCase()}
    </Button>
    <Button
      onClick={onDocumentSave}
      className="gap-2 hover:opacity-90 bg-black hover:bg-black/90 text-white font-bold"
    >
      {isSaving ? "Saving..." : "Save"}
    </Button>
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        disabled={!generatedDoc}
        style={{ borderColor: COLORS.primary, color: COLORS.primary }}
      >
        <Share className="h-4 w-4" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        disabled={!generatedDoc}
        style={{ borderColor: COLORS.primary, color: COLORS.primary }}
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
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
  const session = searchParams.get("session");
  const videoRef = useRef<HTMLVideoElement>(null);

  const [useCustomDocs, setUseCustomDocs] = useState(false);
  const [documentTypes, setDocumentTypes] = useState(HARDCODED_DOCUMENT_TYPES);
  const [customDocuments, setCustomDocuments] = useState<CustomDocumentBase[]>(
    []
  );
  const [selectedDocument, setSelectedDocument] = useState("soap");
  const [activeTab, setActiveTab] = useState("soap");
  const [showCaution, setShowCaution] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
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

  // Fetch custom documents
  useEffect(() => {
    const fetchCustomDocuments = async () => {
      if (session) {
        const response = await getAllCustomDocumentBySession();
        if (response?.success && response.customDocument) {
          setCustomDocuments(
            Array.isArray(response.customDocument)
              ? response.customDocument
              : [response.customDocument]
          );
        }
      }
    };
    fetchCustomDocuments();
  }, [session]);

  // Update document types based on mode
  useEffect(() => {
    if (useCustomDocs) {
      setDocumentTypes(
        customDocuments.map((doc) => ({
          id: doc.id,
          label: doc.DocumentName,
          description: doc.Description,
          custom: true,
        }))
      );
      if (customDocuments.length > 0) {
        setActiveTab(customDocuments[0].id);
        setSelectedDocument(customDocuments[0].id);
      }
    } else {
      setDocumentTypes(HARDCODED_DOCUMENT_TYPES);
      setActiveTab("soap");
      setSelectedDocument("soap");
    }
  }, [useCustomDocs, customDocuments]);

  // Fetch document when tab changes
  useEffect(() => {
    const fetchDocument = async () => {
      if (useCustomDocs) {
        const templateId = customDocuments.find(
          (doc) => doc.id === activeTab
        )?.id;
        const doc = await getCustomDocumentByTemplateId({
          templateId: templateId!,
        });
        console.log("Fetched custom document:", doc);
        setGeneratedDoc(doc ? JSON.parse(doc) : "");
      }
      if (!useCustomDocs) {
        if (session && activeTab) {
          const doc = await getDocumentBySession({
            sessionId: session,
            documentType: activeTab,
          });
          setGeneratedDoc(doc ? JSON.parse(doc) : "");
        }
      }
    };
    fetchDocument();
  }, [session, activeTab, setGeneratedDoc]);

  const currentDocumentType = documentTypes.find((doc) => doc.id === activeTab);

  const renderValue = (value: unknown) => {
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
  };

  const onGenerateDocument = () => {
    setGenrating(true);
    if (selectedDocument) {
      const template = documentTypes.find((doc) => doc.id === selectedDocument);
      generateDocument({
        transcript: transcription || "",
        document_type: template?.label || "",
        custom: useCustomDocs,
        template_id: template?.id || "",
      })
        .then((response) => {
          if (response.status === "error") {
            errorAudioRef.current?.play();
            setShowCaution(true);
            setGenrating(false);
            return;
          }
          setGeneratedDoc(response.data.generated_document);
          setGenrating(false);
          audioRef.current
            ?.play()
            .catch((e) => console.log("Audio play failed:", e));
        })
        .catch(console.error);
    }
  };

  const onDocumentSave = async () => {
    if (!session) return;
    setIsSaving(true);
    if (useCustomDocs) {
      const customDocument = customDocuments.find(
        (doc) => doc.id === selectedDocument
      );
      if (customDocument) {
        const templateId = customDocument.id;
        const result = await saveDocument({
          documentType: activeTab,
          content: generatedDoc,
          sessionId: session,
          templateId: templateId,
          customTemplate: useCustomDocs,
        });
        alert(
          result ? "Document saved successfully" : "Failed to save document"
        );
      }
    } else {
      const result = await saveDocument({
        documentType: activeTab,
        content: generatedDoc,
        sessionId: session,
        templateId: "",
        customTemplate: useCustomDocs,
      });
      alert(result ? "Document saved successfully" : "Failed to save document");
    }

    setIsSaving(false);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-gradient-card rounded-xl p-6 shadow-lg border border-[#e2e8f0] backdrop-blur-sm">
        <DocumentHeader />
        <TemplateModeToggle
          useCustomDocs={useCustomDocs}
          setUseCustomDocs={setUseCustomDocs}
        />
        <DocumentTypeSelector
          documentTypes={documentTypes}
          currentDocumentType={currentDocumentType}
          setActiveTab={setActiveTab}
          setSelectedDocument={setSelectedDocument}
        />
        <DocumentDisplay
          genrating={genrating}
          generatedDoc={generatedDoc}
          renderValue={renderValue}
        />
        <ActionButtons
          activeTab={activeTab}
          generatedDoc={generatedDoc}
          onGenerateDocument={onGenerateDocument}
          onDocumentSave={onDocumentSave}
          isSaving={isSaving}
        />
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
