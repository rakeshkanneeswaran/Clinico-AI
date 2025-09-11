"use client";

import { useEffect, useState } from "react";
import { getAllCreatedTemplatesByUserId, deleteTemplate } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil, Star, MoreHorizontal, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TemplateForm from "@/components/TemplateForm"; // <-- adjust import path if different

type Template = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  isCustom: boolean;
  fields: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string;
    templateId: string | null;
  }[];
  userTemplates: {
    id: string;
    userId: string;
    createdAt: Date;
    templateId: string;
  }[];
};

export default function TemplateLibrary() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await getAllCreatedTemplatesByUserId();
      setTemplates(res);
    } catch (err) {
      console.error("Failed to load templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userTemplateId: string) => {
    const warningMessage =
      "⚠️ Warning: Deleting this template will also permanently delete ALL session documents linked to it.\n\nThis action cannot be undone.\n\nAre you sure you want to continue?";

    if (!confirm(warningMessage)) return;

    try {
      await deleteTemplate({ userTemplateId });
      setTemplates((prev) =>
        prev.filter(
          (t) => !t.userTemplates.some((ut) => ut.id === userTemplateId)
        )
      );
      alert(
        "Template and its related session documents were deleted successfully."
      );
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Error deleting template. Please try again.");
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Filter templates by search
  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header row with title + create button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Library</h1>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <Input
          placeholder="Search templates by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Templates table */}
      {loading ? (
        <p>Loading templates...</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2">Template name</th>
                <th className="px-4 py-2">Uses</th>
                <th className="px-4 py-2">Creator</th>
                <th className="px-4 py-2">Visibility</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{t.name}</td>
                  <td className="px-4 py-2">{t.userTemplates.length}</td>
                  <td className="px-4 py-2 text-gray-700">You</td>
                  <td className="px-4 py-2 text-gray-500">Just me</td>
                  <td className="px-4 py-2 flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-red-600"
                      onClick={() => handleDelete(t.userTemplates[0]?.id || "")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-yellow-500"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredTemplates.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No templates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Template Popup */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl min-h-[80vh] backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Create a New Template</DialogTitle>
          </DialogHeader>
          <TemplateForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
