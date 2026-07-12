'use client';

import { ReactNode } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import Link from 'next/link';

interface FileCardProps {
  icon: ReactNode;
  name: string;
  fileName: string;
  fileUrl: string;
}

const ReadFileCard = ({ icon, name, fileName, fileUrl }: FileCardProps) => {
  return (
    <div
      dir="rtl"
      className="w-full max-w-xs rounded-2xl border border-neutral-300 bg-white p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white">
          {icon}
        </div>

        <span className="rounded-full bg-primary-100 px-3 py-1 text-12 font-bold text-primary-600">
          مرفق
        </span>
      </div>

      <p className="mb-2 text-14 font-bold text-secondary-900">{name}</p>

      <div className="mb-3 flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2">
        <FileText className="h-4 w-4 text-neutral-500" />
        <span className="truncate text-13 text-secondary-700">{fileName}</span>
      </div>

      <div className="flex gap-2">
        <Link
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1 rounded-full border border-neutral-300 py-2 text-13 text-secondary-700 hover:bg-neutral-100"
        >
          <Eye className="h-4 w-4" />
          معاينة
        </Link>

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
      </div>
    </div>
  );
};

export default ReadFileCard;
