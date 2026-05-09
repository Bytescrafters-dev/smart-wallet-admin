"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileSpreadsheet } from "lucide-react";

interface Props {
  onFile: (file: File) => void;
}

export const ImportDropzone = ({ onFile }: Props) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-8 py-16 cursor-pointer transition-colors
        ${dragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40"}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        {dragging ? (
          <UploadCloud className="h-7 w-7 text-primary" />
        ) : (
          <FileSpreadsheet className="h-7 w-7 text-muted-foreground" />
        )}
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-medium">
          {dragging ? "Drop your file here" : "Drag & drop your Excel file"}
        </p>
        <p className="text-xs text-muted-foreground">
          or click to browse — .xlsx files only
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
      >
        Select File
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};
