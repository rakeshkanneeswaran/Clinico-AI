"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Trash2,
  Pencil,
  Save,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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

  const colors = {
    primary: "#3b82f6",
    secondary: "#000000",
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

    setEditFieldData({ label: "", description: "" });
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
    setEditFieldData({ label: "", description: "" });
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    if (isEditing === id) {
      cancelEditing();
    }
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

  const saveTemplate = () => {
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
    };

    // Here you would typically send the data to your API
    console.log("Saving template:", templateData);
    toast.success("Template saved successfully!");
  };

  return (
    <div className="container mx-auto py-8">
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
              Custom Template
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Template Metadata */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Template Name *
                </label>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Clinical Progress Note"
                  className="max-w-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Description
                </label>
                <Textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Briefly describe what this template is for"
                  className="max-w-lg"
                  rows={3}
                />
              </div>
            </div>

            {/* Field Editor */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Template Fields
              </h3>

              <Card className="bg-muted/50 border-border/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {isEditing ? "Edit Field" : "Add New Field"} *
                      </label>
                      <Input
                        value={editFieldData.label || ""}
                        onChange={(e) =>
                          setEditFieldData({
                            ...editFieldData,
                            label: e.target.value,
                          })
                        }
                        placeholder="Field label (e.g., 'Assessment')"
                        className="mb-3"
                      />
                      <Textarea
                        value={editFieldData.description || ""}
                        onChange={(e) =>
                          setEditFieldData({
                            ...editFieldData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Field description (e.g., 'Clinical assessment of the patient')"
                        rows={2}
                      />
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

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <Card
                      key={field.id}
                      className="border-border/50 hover:border-primary/50 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-foreground">
                              {field.label}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {field.description}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveField(field.id, "up")}
                              disabled={index === 0}
                              className="h-8 w-8"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveField(field.id, "down")}
                              disabled={index === fields.length - 1}
                              className="h-8 w-8"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditing(field)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteField(field.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Save Template */}
            <div className="pt-4">
              <Button
                onClick={saveTemplate}
                className="gap-2"
                size="lg"
                style={{ backgroundColor: colors.primary }}
              >
                <Save className="h-4 w-4" />
                Save Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
