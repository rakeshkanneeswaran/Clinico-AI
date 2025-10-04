"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Pencil, Save, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSpecificCustomDocumentForView } from "../actions";

export default function TemplateViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({
    DocumentName: "",
    Description: "",
    fields: [],
  });

  useEffect(() => {
    params.then((p) => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const response = await getSpecificCustomDocumentForView({
          templateId: resolvedParams.id!,
        });

        if (response?.success) {
          setTemplate(response.content);
          setEditData({
            DocumentName: response.content.DocumentName,
            Description: response.content.Description,
            fields: response.content.fields || [],
          });
        } else {
          setError("Failed to load template");
        }
      } catch (err) {
        setError("An error occurred while loading template");
        console.error("Error fetching template:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [resolvedParams?.id]);

  const handleSave = async () => {
    try {
      // TODO: call your API here with `editData`
      toast.success("Template updated successfully");
      setIsEditing(false);

      const response = await getSpecificCustomDocumentForView({
        templateId: resolvedParams?.id!,
      });
      if (response?.success) {
        setTemplate(response.content);
      }
    } catch (err) {
      toast.error("Failed to update template");
      console.error("Error updating template:", err);
    }
  };

  const handleFieldChange = (index: number, key: string, value: string) => {
    const updatedFields = [...editData.fields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setEditData({ ...editData, fields: updatedFields });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/template">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Templates
          </Link>
        </Button>
        <div className="mt-6 bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/template">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Templates
          </Link>
        </Button>
        <div className="mt-6 bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-red-500">{error || "Template not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/template">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            {isEditing ? (
              <Input
                value={editData.DocumentName}
                onChange={(e) =>
                  setEditData({ ...editData, DocumentName: e.target.value })
                }
                className="text-2xl font-bold w-auto min-w-[300px]"
              />
            ) : (
              <h1 className="text-2xl font-bold">{template.DocumentName}</h1>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editable Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editData.Description}
                    onChange={(e) =>
                      setEditData({ ...editData, Description: e.target.value })
                    }
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {template.Description || "No description available"}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fields</CardTitle>
                <CardDescription>
                  {editData.fields.length} field(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {editData.fields.map((field: any, index: number) => (
                      <div
                        key={field.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-2"
                      >
                        {isEditing ? (
                          <>
                            <Input
                              value={field.FieldName}
                              onChange={(e) =>
                                handleFieldChange(
                                  index,
                                  "FieldName",
                                  e.target.value
                                )
                              }
                              placeholder="Field Name"
                            />
                            <Textarea
                              value={field.FieldDescription || ""}
                              onChange={(e) =>
                                handleFieldChange(
                                  index,
                                  "FieldDescription",
                                  e.target.value
                                )
                              }
                              placeholder="Field Description"
                              rows={2}
                            />
                          </>
                        ) : (
                          <>
                            <h3 className="font-medium">{field.FieldName}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {field.FieldDescription || (
                                <span className="italic">No description</span>
                              )}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Read-only Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Template Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant="outline" className="mt-1">
                    {template.custom ? "Custom" : "System"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
