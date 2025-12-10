"use client";

import { useState } from "react";
import { IconUpload } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, alt: string) => void;
  isUploading: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export default function ImageUploadModal({
  open,
  onOpenChange,
  onUpload,
  isUploading,
}: ImageUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error("Invalid file type. Only JPEG, JPG, and PNG are allowed.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = () => {
    if (!file) {
      toast.error("Please select an image.");
      return;
    }
    if (!alt.trim()) {
      toast.error("Please provide alt text.");
      return;
    }
    onUpload(file, alt);
  };

  const handleClose = () => {
    setFile(null);
    setAlt("");
    setPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Product Image</DialogTitle>
          <DialogDescription>
            Upload a new image for this product. Max size: 10MB. Formats: JPEG,
            JPG, PNG.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="image-file">Image File</Label>
            <Input
              id="image-file"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>

          {preview && (
            <div className="relative aspect-video w-full rounded-lg border overflow-hidden bg-muted">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div>
            <Label htmlFor="alt-text">Alt Text</Label>
            <Input
              id="alt-text"
              placeholder="Describe the image"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              disabled={isUploading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!file || isUploading}>
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>
                <IconUpload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
