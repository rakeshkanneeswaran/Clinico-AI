"use client";

import { getAllTemplates } from "./actions";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TemplateField {
  id: string;
  FieldName: string;
  FieldDescription: string;
  customDocumentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Template {
  id: string;
  DocumentName: string;
  Description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  custom: boolean;
  UserId: string | null;
  fields: TemplateField[];
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await getAllTemplates();

        if (response?.success) {
          // Normalize to always work with an array
          const docs = Array.isArray(response.customDocument)
            ? response.customDocument
            : response.customDocument
            ? [response.customDocument]
            : [];
          setTemplates(docs);
        } else {
          setError("Failed to load templates");
        }
      } catch (err) {
        setError("An error occurred while loading templates");
        console.error("Error fetching templates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Templates</h1>
          <Link
            href="/dashboard/template/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Template
          </Link>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Templates</h1>
          <Link
            href="/dashboard/template/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Template
          </Link>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Templates</h1>
          <Link
            href="/dashboard/template/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Template
          </Link>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">No document templates found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Templates</h1>
        <Link
          href="/dashboard/template/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Template
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-left">Name</th>
              <th className="py-3 px-4 border-b text-left">Description</th>
              <th className="py-3 px-4 border-b text-left">Fields</th>
              <th className="py-3 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{doc.DocumentName}</td>
                <td className="py-3 px-4 border-b">{doc.Description}</td>
                <td className="py-3 px-4 border-b">
                  <div className="flex flex-wrap gap-2">
                    {doc.fields.map((field) => (
                      <span
                        key={field.id}
                        className="bg-gray-100 px-2 py-1 rounded text-sm"
                        title={field.FieldDescription}
                      >
                        {field.FieldName}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 border-b">
                  <Link
                    href={`/dashboard/templates/${doc.id}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    View
                  </Link>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
