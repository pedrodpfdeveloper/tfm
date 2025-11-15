"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  name?: string;
  label?: string;
  existingUrl?: string | null;
  accept?: string;
  className?: string;
}

export default function ImageUploader({
  name = "image",
  label = "Imagen",
  existingUrl = null,
  accept = "image/*",
  className = "",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    if (existingUrl) return existingUrl;
    return null;
  }, [file, existingUrl]);

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(previewUrl || "");
    };
  }, [file, previewUrl]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  return (
    <div className={className}>
      <label className="block text-sm mb-1">{label}</label>
      <div
        className={
          `relative border-2 border-dashed rounded-md p-4 transition-colors ` +
          (isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300")
        }
        onDragEnter={() => setIsDragging(true)}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onChange}
          aria-label={label}
        />

        <div className="flex flex-col items-center justify-center text-center gap-3 pointer-events-none">
          {previewUrl ? (
            <div className="w-full">
              <div className="relative w-full aspect-video overflow-hidden rounded-md">
                  <Image
                      src={previewUrl}
                      alt="Vista previa"
                      fill
                      className="object-cover"
                      sizes="100vw"
                  />
              </div>
              <p className="text-xs text-gray-500 mt-2">Arrastra y suelta para cambiar la imagen o haz clic.</p>
            </div>
          ) : (
            <div className="py-8 text-gray-600">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path></svg>
              <p className="font-medium">Arrastra y suelta una imagen aquí</p>
              <p className="text-sm">o haz clic para seleccionar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
