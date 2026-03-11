import { Trash2 } from "lucide-react";

interface Props {
  imageUrls: string[];
  onRemove: (index: number) => void;
  disabled: boolean;
}
function FilePreview({ imageUrls, onRemove, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pt-2">
      {imageUrls.length > 0 &&
        imageUrls.map((imageUrl, index) => (
          <div key={index} className="group relative w-12">
            <img
              src={imageUrl}
              alt="File Preview"
              className="rounded object-cover"
            />
            {!disabled && (
              <button
                onClick={() => onRemove(index)}
                className="absolute -top-2 -right-2 cursor-pointer rounded-full bg-black/75 p-1 text-white transition-opacity md:opacity-0 md:group-hover:opacity-100"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
export default FilePreview;
