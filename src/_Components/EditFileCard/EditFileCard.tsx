// components/EditableFileCard.tsx
'use client';

import { ReactNode, useRef, useState } from 'react';
import { FileText, Download, Eye, RefreshCw, X } from 'lucide-react';
import Link from 'next/link';

interface EditableFileCardProps {
  icon: ReactNode;
  name: string;
  fileName: string;
  fileUrl: string | null; // جاي من السيرفر (signed URL)
  onFileChange?: (file: File | null) => void; // بيتبعت لما المستخدم يختار ملف جديد
}

const EditFileCard = ({
  icon,
  name,
  fileName,
  fileUrl,
  onFileChange,
}: EditableFileCardProps) => {
  const [newFile, setNewFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected && selected.type !== 'application/pdf') {
      alert('من فضلك اختر ملف PDF فقط');
      return;
    }
    setNewFile(selected);
    onFileChange?.(selected);
  };

  const handleCancelReplace = () => {
    setNewFile(null);
    onFileChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayedName = newFile ? newFile.name : fileName;
  const hasNewFile = !!newFile;

  return (
    <div
      dir="rtl"
      className="w-full max-w-xs rounded-2xl border border-neutral-300 bg-white p-4"
    >
      {/* Header: icon + status badge */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white">
          {icon}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-12 font-bold ${
            hasNewFile ?
              'bg-tertiary-100 text-tertiary-500'
            : 'bg-primary-100 text-primary-600'
          }`}
        >
          {hasNewFile ? 'ملف جديد (لم يُحفظ)' : 'مرفق'}
        </span>
      </div>

      <p className="mb-2 text-14 font-bold text-secondary-900">{name}</p>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* File row */}
      <div className="mb-3 flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2">
        {hasNewFile && (
          <button
            type="button"
            onClick={handleCancelReplace}
            className="text-red-500 hover:text-red-600"
            aria-label="إلغاء الاستبدال"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <FileText className="h-4 w-4 text-neutral-500" />
        <span className="truncate text-13 text-secondary-700">
          {displayedName}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {!hasNewFile && fileUrl && (
          <Link
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1 rounded-full border border-neutral-300 py-2 text-13 text-secondary-700 hover:bg-neutral-100"
          >
            <Eye className="h-4 w-4" />
            معاينة
          </Link>
        )}

        {!hasNewFile && fileUrl && (
          <Link
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={fileName}
            className="flex flex-1 items-center justify-center gap-1 rounded-full bg-primary-500 py-2 text-13 font-bold text-white hover:bg-primary-600"
          >
            <Download className="h-4 w-4" />
            تحميل
          </Link>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex items-center justify-center gap-1 px-2 rounded-full border border-neutral-300 py-2 text-13 text-secondary-700 hover:bg-neutral-100 ${
            hasNewFile ? 'flex-1' : ''
          }`}
        >
          <RefreshCw className="h-4 w-4" />
          {hasNewFile ? 'اختيار ملف آخر' : 'تغيير الملف'}
        </button>
      </div>
    </div>
  );
};

export default EditFileCard;
