import { FaImage } from "react-icons/fa";

function DropFileContainer({
  previewImage,
  handleDeleteImage,
  isDragActive,
  ...rest
}: {
  previewImage: string;
  handleDeleteImage: () => void;
  isDragActive: boolean;
  [key: string]: any;
}) {
  return (
    <div
      className={`border-2 p-8 cursor-pointer flex items-center gap-3 justify-center flex-col rounded-lg min-h-[250px] border-dashed`}
      {...rest}
    >
      {previewImage && (
        <div className="relative">
          <img alt="Preview" className="w-full h-full" src={previewImage} />
          <button
            className="absolute bg-red-500 hover:opacity-75 z-10 text-foreground px-1 text-xs top-0 right-0"
            onClick={handleDeleteImage}
            type="button"
          >
            X
          </button>
        </div>
      )}

      {!previewImage && <FaImage color="var(--muted-foreground)" size={36} />}

      {!previewImage &&
        (isDragActive ? (
          <p className="text-muted-foreground  text-xs font-semibold">
            Drop gambar disini ...
          </p>
        ) : (
          <p className="text-muted-foreground  text-xs font-semibold">
            Drag dan drop gambar disini, <br /> atau klik untuk memilih gambar
          </p>
        ))}
    </div>
  );
}

export default DropFileContainer;
