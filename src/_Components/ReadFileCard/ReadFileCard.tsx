import { ReactNode } from 'react';
import { Download, Eye, FileText } from 'lucide-react';
import Link from 'next/link';

interface FileCardProps {
  icon: ReactNode;
  name: string;
  fileName: string;
  fileUrl: string | null;
}

const ReadFileCard = ({ icon, name, fileName, fileUrl }: FileCardProps) => {
  const hasFile = Boolean(fileUrl);

  return (
    <article className="flex min-h-52 w-full flex-col rounded-[18px] border border-[#d4dfeb] bg-white p-4 transition-shadow hover:shadow-[0_10px_26px_rgba(54,74,104,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-500">
          {icon}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-10 font-bold ${
            hasFile ?
              'bg-[#e0f2e9] text-[#257a55]'
            : 'bg-[#edf1f6] text-secondary-400'
          }`}
        >
          {hasFile ? 'مرفق' : 'غير مرفق'}
        </span>
      </div>

      <h3 className="mt-4 text-14 font-bold text-secondary-950">{name}</h3>

      <div className="mt-3 flex min-h-10 items-center gap-2 rounded-xl bg-[#eef3f8] px-3 py-2">
        <FileText className="h-4 w-4 shrink-0 text-secondary-400" />
        <span className="min-w-0 flex-1 truncate text-11 text-secondary-500">
          {hasFile ? `${fileName}.pdf` : 'لا يوجد ملف'}
        </span>
      </div>

      <div className="mt-auto flex gap-2 pt-4">
        {hasFile && fileUrl ?
          <>
            <Link
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-100 text-11 font-semibold text-primary-600 transition-colors hover:bg-primary-200"
            >
              <Eye className="h-4 w-4" />
              معاينة
            </Link>
            <Link
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={fileName}
              className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#cbd7e4] text-11 font-semibold text-secondary-600 transition-colors hover:border-primary-300 hover:text-primary-600"
            >
              <Download className="h-4 w-4" />
              تحميل
            </Link>
          </>
        : <span className="flex min-h-10 w-full items-center justify-center rounded-xl border border-[#d9e1ea] bg-[#f2f5f8] text-11 font-semibold text-secondary-400">
            غير متاح
          </span>
        }
      </div>
    </article>
  );
};

export default ReadFileCard;
