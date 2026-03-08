"use client";

import { useCallback, useState } from "react";
import { Upload, File, X } from "lucide-react";
import { useFileInput } from "@/hooks/use-file-input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FileInputProps {
  /** Label shown above the drop zone */
  label?: string;
  /** Helper text below the label */
  description?: string;
  /** Accepted MIME types / extensions, e.g. "image/*,.pdf" */
  accept?: string;
  /** Maximum file size in megabytes */
  maxSize?: number;
  /** Callback fired when a file is selected (or cleared) */
  onFileChange?: (file: File | null) => void;
  /** Additional class names for the outer wrapper */
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function FileInput({
  label,
  description,
  accept,
  maxSize = 10,
  onFileChange,
  className,
}: FileInputProps) {
  const {
    fileName,
    fileSize,
    error,
    fileInputRef,
    handleFileSelect,
    validateAndSetFile,
    clearFile,
  } = useFileInput({ accept, maxSize });

  const [isDragging, setIsDragging] = useState(false);

  // Wrap the hook's handler so we can also call onFileChange
  const onFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e);
      const file = e.target.files?.[0] ?? null;
      // Only call back if validation would pass (re-check size/type)
      if (file) {
        if (maxSize && file.size > maxSize * 1024 * 1024) return;
        if (accept && !file.type.match(accept.replace("/*", "/"))) return;
        onFileChange?.(file);
      }
    },
    [handleFileSelect, onFileChange, maxSize, accept],
  );

  const handleClear = useCallback(() => {
    clearFile();
    onFileChange?.(null);
  }, [clearFile, onFileChange]);

  // ---- Drag & Drop ----
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      validateAndSetFile(file);

      // Same guard as onFileSelected
      if (maxSize && file.size > maxSize * 1024 * 1024) return;
      if (accept && !file.type.match(accept.replace("/*", "/"))) return;
      onFileChange?.(file);
    },
    [validateAndSetFile, onFileChange, maxSize, accept],
  );

  // Build the hint string shown under the upload prompt
  const hintParts: string[] = [];
  if (accept) {
    const readable = accept
      .split(",")
      .map((t) => {
        const trimmed = t.trim();
        if (trimmed.startsWith(".")) return trimmed.toUpperCase().slice(1);
        if (trimmed === "image/*") return "PNG, JPG, WEBP";
        if (trimmed === "application/pdf") return "PDF";
        return trimmed;
      })
      .join(", ");
    hintParts.push(readable);
  }
  hintParts.push(`up to ${maxSize}MB`);
  const hint = hintParts.join(" - ");

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={onFileSelected}
        className="sr-only"
        aria-label={label ?? "File upload"}
      />

      {fileName ? (
        /* ---- File selected state ---- */
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border bg-muted/40 p-3 transition-colors duration-200",
            error
              ? "border-destructive ring-2 ring-destructive/20"
              : "border-border",
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <File className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{fileName}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(fileSize)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* ---- Drop zone ---- */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all duration-200",
            "hover:border-primary/40 hover:bg-primary/[0.03]",
            isDragging && "border-primary bg-primary/[0.06] scale-[1.01]",
            error
              ? "border-destructive/60 bg-destructive/[0.04]"
              : "border-border",
          )}
        >
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              isDragging
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">
              <span className="text-primary">Click to upload</span>{" "}
              <span className="text-muted-foreground">or drag and drop</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
          </div>
        </button>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
