"use client";

import { useEffect, useState } from "react";
import { getAllSesssionDocuments, saveDocument } from "./action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TemplateField {
  id: string;
  templateId: string | null;
  createdAt: Date;
  name: string;
  description: string;
  updatedAt: Date;
}

interface Template {
  name: string;
  description: string;
  fields: TemplateField[];
}

interface UserTemplate {
  template: Template;
}

interface SessionDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  sessionId: string;
  userTemplateId: string;
  userTemplate: UserTemplate;
}

type DocumentContent = string | Record<string, string>;

export function SessionDocumentsPanel({ sessionId }: { sessionId: string }) {
  const [documents, setDocuments] = useState<SessionDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<SessionDocument | null>(null);
  const [editedContent, setEditedContent] = useState<DocumentContent>("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch documents
  useEffect(() => {
    const fetchDocs = async () => {
      if (sessionId) {
        try {
          const docs = await getAllSesssionDocuments({ sessionId });
          setDocuments(docs || []);
        } catch (error) {
          console.error("Failed to fetch documents:", error);
        }
      }
    };
    fetchDocs();
  }, [sessionId]);

  // Load doc into editor
  const handleSelectDoc = (doc: SessionDocument) => {
    setSelectedDoc(doc);
    setActiveTab("view");
    setIsModalOpen(true);

    try {
      let parsedContent;
      if (typeof doc.content === "string") {
        try {
          parsedContent = JSON.parse(doc.content);
        } catch {
          parsedContent = doc.content;
        }
      } else {
        parsedContent = doc.content;
      }
      setEditedContent(parsedContent);
    } catch {
      setEditedContent(doc.content);
    }
  };

  const handleSave = async () => {
    if (!selectedDoc) return;
    setIsSaving(true);

    try {
      const result = await saveDocument({
        sessionId: selectedDoc.sessionId,
        sessionDocumentId: selectedDoc.id,
        content:
          typeof editedContent === "object"
            ? JSON.stringify(editedContent)
            : editedContent,
        userTemplateId: selectedDoc.userTemplateId,
      });

      if (result) {
        alert("Document updated successfully");
        const docs = await getAllSesssionDocuments({ sessionId });
        setDocuments(docs || []);
        setActiveTab("view");
        setIsModalOpen(false);
      } else {
        alert("Failed to update");
      }
    } catch (error) {
      console.error("Failed to update document:", error);
      alert("Failed to update document");
    } finally {
      setIsSaving(false);
    }
  };

  const formatContentPreview = (content: string) => {
    try {
      let parsed;
      if (typeof content === "string") parsed = JSON.parse(content);
      else parsed = content;

      if (typeof parsed === "object") {
        return (
          <div className="space-y-1">
            {Object.entries(parsed).map(([key, value]) => (
              <div key={key} className="text-xs flex">
                <span className="font-medium mr-1">{key}:</span>
                <span className="text-gray-600 truncate">
                  {typeof value === "string"
                    ? value.substring(0, 40)
                    : JSON.stringify(value).substring(0, 40)}
                  {typeof value === "string" && value.length > 40 ? "..." : ""}
                </span>
              </div>
            ))}
          </div>
        );
      }
      return content.substring(0, 80) + (content.length > 80 ? "..." : "");
    } catch {
      return content.substring(0, 80) + (content.length > 80 ? "..." : "");
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setEditedContent((prev) => {
      if (typeof prev === "string") {
        return { [fieldName]: value };
      }
      return { ...prev, [fieldName]: value };
    });
  };

  const renderBeautifiedContent = () => {
    let contentToRender = editedContent;
    if (typeof editedContent === "string") {
      try {
        if (
          editedContent.trim().startsWith("{") &&
          editedContent.trim().endsWith("}")
        ) {
          contentToRender = JSON.parse(editedContent);
        }
      } catch {}
    }

    if (typeof contentToRender === "object" && contentToRender !== null) {
      return (
        <div className="space-y-6">
          {Object.entries(contentToRender).map(([key, value]) => (
            <div
              key={key}
              className="space-y-2 p-4 border rounded-lg bg-gray-50"
            >
              <h3 className="text-lg font-semibold text-gray-800 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {value as string}
              </p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <p className="text-gray-700 whitespace-pre-wrap">{contentToRender}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Medical Notes</h2>
        <p className="text-gray-600 mb-6">
          View and edit patient session documents
        </p>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Session Documents
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="p-4 cursor-pointer transition-all hover:shadow-md border-gray-200 bg-white"
                  onClick={() => handleSelectDoc(doc)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800">
                      {doc.userTemplate?.template?.name || "Clinical Note"}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-100 text-blue-800"
                    >
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatContentPreview(doc.content)}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Last updated: {new Date(doc.updatedAt).toLocaleString()}
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No documents found for this session.</p>
                <p className="text-sm mt-1">
                  Documents will appear here once created.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal for viewing/editing document */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl w-full p-0 bg-white rounded-lg overflow-hidden backdrop-blur-sm">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="text-xl font-bold">
                {selectedDoc?.userTemplate?.template?.name || "Medical Note"}
              </DialogTitle>
            </DialogHeader>

            {selectedDoc && (
              <div className="p-6 space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger
                      value="view"
                      className="flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Mode
                    </TabsTrigger>
                    <TabsTrigger
                      value="edit"
                      className="flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit Mode
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="view">
                    {renderBeautifiedContent()}
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                      <Button
                        onClick={() => setActiveTab("edit")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Edit Document
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="edit">
                    {typeof editedContent === "object" &&
                    editedContent !== null ? (
                      <div className="space-y-6">
                        {Object.entries(editedContent).map(([key, value]) => (
                          <div
                            key={key}
                            className="space-y-2 p-4 border rounded-lg bg-gray-50"
                          >
                            <Label
                              htmlFor={key}
                              className="text-base font-medium text-gray-700 capitalize"
                            >
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </Label>
                            <Textarea
                              id={key}
                              value={value as string}
                              onChange={(e) =>
                                handleFieldChange(key, e.target.value)
                              }
                              className="min-h-32 text-gray-800 bg-white"
                              placeholder={`Enter ${key
                                .replace(/([A-Z])/g, " $1")
                                .toLowerCase()} details...`}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 p-4 border rounded-lg bg-gray-50">
                        <Label
                          htmlFor="content"
                          className="text-base font-medium text-gray-700"
                        >
                          Content
                        </Label>
                        <Textarea
                          id="content"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="min-h-48 text-gray-800 bg-white"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("view")}
                        className="border-gray-300 text-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSaving ? "Saving Changes..." : "Save Changes"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
