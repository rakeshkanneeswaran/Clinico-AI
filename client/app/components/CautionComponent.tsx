"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CautionComponentProps {
  onCancel: () => void;
}

export function CautionComponent({ onCancel }: CautionComponentProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gradient-card rounded-xl p-6 shadow-lg border border-gray-200 dark:border-border/50 backdrop-blur-sm max-w-md w-full animate-in fade-in zoom-in-95">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-500/20">
            <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-500" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground">
            Content Verification Needed
          </h3>

          <p className="text-sm text-gray-600 dark:text-muted-foreground">
            The conversation does not appear to be medically relevant. Please
            ensure you are uploading correct and relevant medical conversations
            to generate accurate documentation.
          </p>

          <div className="flex gap-3 mt-4 w-full">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 dark:border-border"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
