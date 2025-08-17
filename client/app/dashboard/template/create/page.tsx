"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createCustomDocument } from "./action";
import {
  FileText,
  Plus,
  Trash2,
  Pencil,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateField {
  id: string;
  label: string;
  description: string;
}

export default function TemplateCreatorPage() {
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editFieldData, setEditFieldData] = useState<Partial<TemplateField>>({
    label: "",
    description: "",
  });
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );

  const colors = {
    primary: "#3b82f6",
    accent: "#10b981",
    badge: "#6366f1",
    iconBg: "#4f46e5",
  };

  const addNewField = () => {
    if (!editFieldData.label) {
      toast.warning("Field label is required");
      return;
    }

    if (isEditing) {
      // Update existing field
      setFields(
        fields.map((field) =>
          field.id === isEditing
            ? {
                ...field,
                label: editFieldData.label || field.label,
                description: editFieldData.description || field.description,
              }
            : field
        )
      );
      setIsEditing(null);
    } else {
      // Add new field
      const newField: TemplateField = {
        id: Date.now().toString(),
        label: editFieldData.label || "",
        description: editFieldData.description || "",
      };
      setFields([...fields, newField]);
    }

    setEditFieldData({
      label: "",
      description: "",
    });
  };

  const startEditing = (field: TemplateField) => {
    setIsEditing(field.id);
    setEditFieldData({
      label: field.label,
      description: field.description,
    });
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setEditFieldData({
      label: "",
      description: "",
    });
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    if (isEditing === id) {
      cancelEditing();
    }
    toast.success("Field deleted");
  };

  const moveField = (id: string, direction: "up" | "down") => {
    const index = fields.findIndex((field) => field.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === fields.length - 1)
    ) {
      return;
    }

    const newFields = [...fields];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newFields[index], newFields[newIndex]] = [
      newFields[newIndex],
      newFields[index],
    ];
    setFields(newFields);
  };

  const saveTemplate = async () => {
    if (!templateName) {
      toast.warning("Template name is required");
      return;
    }

    if (fields.length === 0) {
      toast.warning("Please add at least one field to the template");
      return;
    }

    const templateData = {
      name: templateName,
      description: templateDescription,
      fields: fields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createCustomDocument({ customDocumentData: templateData });
    console.log("Saving template:", templateData);
    toast.success("Template saved successfully!");
  };

  const renderPreview = () => {
    return (
      <TooltipProvider>
        <div
          className={`${previewMode === "mobile" ? "max-w-md mx-auto" : ""}`}
        >
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {templateName || "Untitled Template"}
                  </h2>
                  {templateDescription && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {templateDescription}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  PREVIEW
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No fields added yet
                </div>
              ) : (
                fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      {field.description && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-muted-foreground cursor-help">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                              </svg>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            {field.description}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <Textarea
                      id={field.id}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      rows={4}
                    />
                  </div>
                ))
              )}
            </CardContent>

            {fields.length > 0 && (
              <CardFooter className="border-t border-border/50 flex justify-end">
                <Button size="sm">Submit</Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </TooltipProvider>
    );
  };

  const renderGeneratedDoc = () => {
    if (fields.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No fields added yet
        </div>
      );
    }

    return (
      <TooltipProvider>
        <div className="space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="mb-4">
              <h3 className="text-base font-bold capitalize text-primary mb-1">
                {field.label}
              </h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {field.description || "No content yet"}
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
    );
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Template Builder
          </h1>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                document.location.href = "/dashboard/template";
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Templates
            </Button>
          </div>
        </div>

        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger
              value="editor"
              onClick={() => setActiveTab("editor")}
              className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              onClick={() => setActiveTab("preview")}
              className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          {activeTab === "editor" ? (
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: colors.iconBg }}
                    >
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle>Create New Template</CardTitle>
                      <CardDescription>
                        Design your custom documentation template
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="gap-1.5"
                    style={{ borderColor: colors.badge, color: colors.badge }}
                  >
                    Simple Editor
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-8">
                  {/* Template Metadata */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="template-name">
                        Template Name{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="template-name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="e.g., Clinical Progress Note"
                        className="max-w-lg mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This will be the display name for your template
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="template-description">Description</Label>
                      <Textarea
                        id="template-description"
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        placeholder="Briefly describe what this template is for"
                        className="max-w-lg mt-1"
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This will help others understand when to use this
                        template
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Field Editor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Template Fields
                    </h3>

                    <Card className="bg-muted/50 border-border/50">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="grid gap-4">
                            <div>
                              <Label htmlFor="field-label">
                                {isEditing ? "Edit Field" : "Add New Field"}{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="field-label"
                                value={editFieldData.label || ""}
                                onChange={(e) =>
                                  setEditFieldData({
                                    ...editFieldData,
                                    label: e.target.value,
                                  })
                                }
                                placeholder="Field label (e.g., 'Assessment')"
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label htmlFor="field-description">
                                Description
                              </Label>
                              <Textarea
                                id="field-description"
                                value={editFieldData.description || ""}
                                onChange={(e) =>
                                  setEditFieldData({
                                    ...editFieldData,
                                    description: e.target.value,
                                  })
                                }
                                placeholder="Field description (e.g., 'Clinical assessment of the patient')"
                                rows={2}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={addNewField}
                              className="gap-2"
                              style={{ backgroundColor: colors.accent }}
                            >
                              {isEditing ? (
                                <>
                                  <Pencil className="h-4 w-4" />
                                  Update Field
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4" />
                                  Add Field
                                </>
                              )}
                            </Button>

                            {isEditing && (
                              <Button variant="outline" onClick={cancelEditing}>
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Fields List */}
                  {fields.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-foreground">
                        Current Fields ({fields.length})
                      </h4>

                      <ScrollArea className="h-[300px] rounded-md border">
                        <div className="space-y-2 p-2">
                          {fields.map((field, index) => (
                            <Card
                              key={field.id}
                              className="border-border/50 hover:border-primary/50 transition-colors group"
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium text-foreground">
                                      {field.label}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                      {field.description || (
                                        <span className="italic">
                                          No description
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            moveField(field.id, "up")
                                          }
                                          disabled={index === 0}
                                          className="h-8 w-8"
                                        >
                                          <ArrowUp className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Move up</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            moveField(field.id, "down")
                                          }
                                          disabled={index === fields.length - 1}
                                          className="h-8 w-8"
                                        >
                                          <ArrowDown className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Move down</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => startEditing(field)}
                                          className="h-8 w-8"
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => deleteField(field.id)}
                                          className="h-8 w-8 text-destructive hover:text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Delete</TooltipContent>
                                    </Tooltip>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t border-border/50 pt-6">
                <Button variant="outline" onClick={cancelEditing}>
                  Clear All
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("preview")}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    onClick={saveTemplate}
                    className="gap-2"
                    style={{ backgroundColor: colors.primary }}
                    disabled={!templateName || fields.length === 0}
                  >
                    <Save className="h-4 w-4" />
                    Save Template
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Template Preview</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={
                        previewMode === "desktop" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setPreviewMode("desktop")}
                    >
                      Desktop
                    </Button>
                    <Button
                      variant={previewMode === "mobile" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("mobile")}
                    >
                      Mobile
                    </Button>
                  </div>
                </div>

                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Document Preview</CardTitle>
                    <CardDescription>
                      How the generated document will look
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={
                        previewMode === "mobile" ? "max-w-md mx-auto" : ""
                      }
                    >
                      {renderGeneratedDoc()}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("editor")}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Editor
                  </Button>
                  <Button
                    onClick={saveTemplate}
                    className="gap-2"
                    style={{ backgroundColor: colors.primary }}
                    disabled={!templateName || fields.length === 0}
                  >
                    <Save className="h-4 w-4" />
                    Save Template
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
