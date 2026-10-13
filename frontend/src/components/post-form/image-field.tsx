import { useDropzone } from "react-dropzone";

import type { ControllerRenderProps } from "react-hook-form";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import type { PostForm } from "@/types/post";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

interface Props {
  field: ControllerRenderProps<PostForm, "image">;
}

export default function ImageField({ field }: Props) {
  const [preview, setPreview] = useState<{URL: string, name: string} | null>(null);

  const {
    getRootProps,
    getInputProps,
    isDragGlobal,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  });

  function onDrop(acceptedFiles: File[]) {
    field.onChange(acceptedFiles[0]);
    setPreview({URL: URL.createObjectURL(acceptedFiles[0]), name: acceptedFiles[0].name});
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview.URL);
    };
  }, [preview]);

  return (
    <Field>
      <FieldLabel htmlFor="image">Image</FieldLabel>
      <div
        {...getRootProps({
          className: cn(
            "p-3 min-h-50 border border-input w-10 rounded",
            isDragAccept && "border-primary ring-3 ring-ring/50",
            isDragReject && "border-destructive ring-3 ring-destructive/50",
          ),
        })}
      >
        <Input {...getInputProps({ id: "image" })} />
        {!isDragGlobal && !preview && (
          <p className="text-muted-foreground">
            <span className="hidden md:inline">Drage images here, or</span>{" "}
            click to select files.
          </p>
        )}

        {isDragGlobal && !isDragActive && (
          <p className="text-muted-foreground">Dragging...</p>
        )}
        {isDragAccept && (
          <p className="text-primary">Drop to upload these files.</p>
        )}
        {isDragReject && (
          <p className="text-destructive">
           Image size should be smaller than 5mb.
          </p>
        )}
        {preview && !isDragGlobal && <p className="text-muted-foreground">{preview.name}</p>}
        {preview && (
          <aside className="flex flex-wrap h-full p-10">
            <img
              src={preview.URL}
              className="w-full"
              onLoad={() => URL.revokeObjectURL(preview.URL)}
            />
          </aside>
        )}
      </div>
    </Field>
  );
}
