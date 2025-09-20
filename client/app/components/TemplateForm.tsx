"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTemplate } from "@/dashboard/template/create/action";
import { Trash2 } from "lucide-react";
import { Template, DocumentField } from "@/data-core/services/types";

export default function TemplateForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<DocumentField[]>([
    { name: "", label: "", description: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const session = localStorage.getItem("session_id");

  // Add a new field row
  const handleAddField = () => {
    setFields([...fields, { name: "", label: "", description: "" }]);
  };

  // Remove field by index
  const handleRemoveField = (index: number) => {
    if (fields.length <= 1) return;
    setFields(fields.filter((_, i) => i !== index));
  };

  // Update field
  const handleChangeField = (
    index: number,
    key: keyof DocumentField,
    value: string
  ) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const templateData: Template = {
        name,
        description,
        fields,
      };
      await createTemplate({
        sessionId: session || "",
        Template: templateData,
      });

      // Reset form
      setName("");
      setDescription("");
      setFields([{ name: "", label: "", description: "" }]);
      alert("✅ Template created successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error creating template. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 border rounded-xl shadow-md bg-white"
      >
        {/* Template Name */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-sm font-medium">Template Name</label>
            <span className="text-xs text-gray-500">
              [Displayed in template lists]
            </span>
          </div>
          <Input
            placeholder="e.g. Clinical Note Template"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="py-2"
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-sm font-medium">Description</label>
            <span className="text-xs text-gray-500">
              [Brief explanation of template usage]
            </span>
          </div>
          <Textarea
            placeholder="Describe what this template is for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Fields</h3>
              <span className="text-xs text-gray-500">
                [Data points captured by this template]
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddField}
            >
              + Add Field
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Field Name */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Field Name
                    </label>
                    <Input
                      placeholder="e.g. Diagnosis"
                      value={field.name}
                      onChange={(e) =>
                        handleChangeField(idx, "name", e.target.value)
                      }
                      required
                      className="bg-white"
                    />
                  </div>

                  {/* Field Label */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Label
                    </label>
                    <Input
                      placeholder="e.g. Dx"
                      value={field.label}
                      onChange={(e) =>
                        handleChangeField(idx, "label", e.target.value)
                      }
                      required
                      className="bg-white"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Description
                    </label>
                    <Input
                      placeholder="e.g. Primary diagnosis code"
                      value={field.description}
                      onChange={(e) =>
                        handleChangeField(idx, "description", e.target.value)
                      }
                      className="bg-white"
                    />
                  </div>
                </div>

                {/* Remove field */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveField(idx)}
                  disabled={fields.length <= 1}
                  className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 mt-5"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6"
          >
            {loading ? "Creating..." : "Create Template"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setName("");
              setDescription("");
              setFields([{ name: "", label: "", description: "" }]);
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
