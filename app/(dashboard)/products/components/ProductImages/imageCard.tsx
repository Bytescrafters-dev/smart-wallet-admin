import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical, IconX, IconStar } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/types/productImage";

interface ImageCardProps {
  image: ProductImage;
  onDelete: (imageId: string) => void;
  onSetPrimary: (imageId: string) => void;
}

export default function ImageCard({
  image,
  onDelete,
  onSetPrimary,
}: ImageCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`relative aspect-square rounded-lg border bg-muted overflow-hidden group ${
        isDragging ? "opacity-50 z-50" : ""
      }`}
    >
      <img
        src={image.url}
        alt={image.alt}
        className="w-full h-full object-cover"
      />

      <div className="absolute top-2 left-2 flex gap-1">
        <Button
          {...attributes}
          {...listeners}
          variant="secondary"
          size="icon"
          className="h-8 w-8 cursor-grab active:cursor-grabbing"
        >
          <IconGripVertical className="h-4 w-4" />
        </Button>
        {image.isPrimary && (
          <Badge variant="default" className="h-8 px-2">
            <IconStar className="h-3 w-3 mr-1 fill-current" />
            Primary
          </Badge>
        )}
      </div>

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!image.isPrimary && (
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={() => onSetPrimary(image.id)}
          >
            <IconStar className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDelete(image.id)}
        >
          <IconX className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
        {image.alt || "No alt text"}
      </div>
    </div>
  );
}
