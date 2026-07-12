// components/FileUploadCard.tsx
'use client';

import { LucideIcon, X, FileText, Download, Eye, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface FileUploadCardProps {
  icon: LucideIcon;
  name: string;
  onFileSelect?: (file: File | null) => void;
}

const FileUploadCard = ({
  icon: Icon,
  name,
  onFileSelect,
}: FileUploadCardProps) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected && selected.type !== 'application/pdf') {
      alert('من فضلك اختر ملف PDF فقط');
      return;
    }
    setFile(selected);
    onFileSelect?.(selected);
  };

  const handleRemove = () => {
    setFile(null);
    onFileSelect?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  return (
    <div
      dir="rtl"
      className="w-full max-w-xs rounded-2xl border border-neutral-300 bg-white p-4"
    >
      {/* Header: icon + status badge */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white">
          <Icon className="h-4 w-4" />
        </div>
        {file && (
          <span className="rounded-full bg-primary-100 px-3 py-1 text-12 font-bold text-primary-600">
            تم الرفق
          </span>
        )}
      </div>

      {/* Title */}
      <p className="mb-2 text-14 font-bold text-secondary-900">{name}</p>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* File row / upload trigger */}
      {file ?
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2">
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600"
            aria-label="حذف الملف"
          >
            <X className="h-4 w-4" />
          </button>
          <FileText className="h-4 w-4 text-neutral-500" />
          <span className="truncate text-13 text-secondary-700">
            {file.name}
          </span>
        </div>
      : <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-3 py-3 text-13 text-neutral-600 hover:bg-neutral-100"
        >
          <Upload className="h-4 w-4" />
          اختر ملف PDF
        </button>
      }

      {/* Actions */}
      {file && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePreview}
            className="flex flex-1 items-center justify-center gap-1 rounded-full border border-neutral-300 py-2 text-13 text-secondary-700 hover:bg-neutral-100"
          >
            <Eye className="h-4 w-4" />
            معاينة
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-1 rounded-full bg-primary-500 py-2 text-13 font-bold text-white hover:bg-primary-600"
          >
            <Download className="h-4 w-4" />
            تحميل
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadCard;
