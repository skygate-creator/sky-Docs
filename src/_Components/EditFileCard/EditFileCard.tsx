'use client';

import { ReactNode, useRef, useState } from 'react';
import { Eye, FilePlus2, FileText, Pencil, RefreshCw, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { validatePdfFile } from '@/Utils/fileValidation';

interface EditableFileCardProps {
  icon: ReactNode;
  name: string;
  fileName: string;
  fileUrl: string | null;
  onFileChange?: (file: File | null) => void;
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;

    const validationError = selectedFile ? validatePdfFile(selectedFile) : null;
    if (validationError) {
      toast.error(validationError, { position: 'top-center' });
      event.target.value = '';
      return;
    }

    setNewFile(selectedFile);
    onFileChange?.(selectedFile);
  };

  const handleCancelReplace = () => {
    setNewFile(null);
    onFileChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const hasExistingFile = Boolean(fileUrl);

  return (
    <article className="flex min-h-72 w-full flex-col rounded-[16px] border border-[#d4dfeb] bg-white p-4 transition-shadow hover:shadow-[0_10px_26px_rgba(54,74,104,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-500">
          {icon}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-10 font-bold ${
            newFile ?
              'bg-[#f8ebce] text-[#9b681e]'
            : hasExistingFile ?
              'bg-[#e0f2e9] text-[#257a55]'
            : 'bg-[#edf1f6] text-secondary-400'
          }`}
        >
          {newFile ? 'جاهز للاستبدال' : hasExistingFile ? 'مرفق' : 'غير مرفق'}
        </span>
      </div>

      <h3 className="mt-4 text-14 font-bold text-secondary-950">{name}</h3>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {hasExistingFile && fileUrl ?
        <div className="mt-4">
          <p className="mb-2 text-10 font-semibold text-secondary-400">
            الملف الحالي
          </p>
          <div className="flex min-h-11 items-center gap-2 rounded-xl bg-[#eef3f8] px-3 py-2">
            <FileText className="h-4 w-4 shrink-0 text-secondary-400" />
            <span className="min-w-0 flex-1 truncate text-11 text-secondary-600">
              {fileName}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-[#cbd7e4] text-11 font-semibold text-secondary-600 transition-colors hover:border-primary-300 hover:text-primary-600"
            >
              <Eye className="h-4 w-4" />
              عرض الملف
            </Link>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#dce5ef] text-11 font-semibold text-secondary-700 transition-colors hover:bg-primary-100 hover:text-primary-600"
            >
              <Pencil className="h-4 w-4" />
              تعديل الملف
            </button>
          </div>
        </div>
      : <div className="mt-4 flex flex-1 flex-col">
          <div className="flex min-h-11 items-center gap-2 rounded-xl bg-[#eef3f8] px-3 py-2">
            <FileText className="h-4 w-4 shrink-0 text-secondary-400" />
            <span className="text-11 text-secondary-400">لا يوجد ملف حالي</span>
          </div>
          {!newFile && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-auto flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#dce5ef] text-11 font-semibold text-secondary-700 transition-colors hover:bg-primary-100 hover:text-primary-600"
            >
              <FilePlus2 className="h-4 w-4" />
              إضافة ملف
            </button>
          )}
        </div>
      }

      {newFile && (
        <div className="mt-3 border-t border-[#dbe3ec] pt-3">
          <p className="mb-2 text-10 font-semibold text-[#9b681e]">
            الملف الجديد بعد الحفظ
          </p>
          <div className="flex min-h-11 items-center gap-2 rounded-xl bg-[#fff7e7] px-3 py-2">
            <FileText className="h-4 w-4 shrink-0 text-[#9b681e]" />
            <span className="min-w-0 flex-1 truncate text-11 text-secondary-700">
              {newFile.name}
            </span>
            <button
              type="button"
              onClick={handleCancelReplace}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
              aria-label="إلغاء استبدال الملف"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-xl text-11 font-semibold text-primary-600 transition-colors hover:bg-primary-50"
          >
            <RefreshCw className="h-4 w-4" />
            اختيار ملف آخر
          </button>
        </div>
      )}
    </article>
  );
};

export default EditFileCard;
