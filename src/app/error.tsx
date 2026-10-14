'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorPage = ({ reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-[1300px] items-center justify-center p-3">
      <section className="w-full max-w-lg rounded-[22px] border border-[#ead7d7] bg-white p-6 text-center shadow-[0_14px_40px_rgba(54,74,104,0.08)] sm:p-9">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-500">
          <AlertTriangle className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-24 font-bold text-secondary-950">
          حدث خطأ غير متوقع
        </h1>
        <p className="mt-2 text-13 leading-7 text-secondary-500">
          لم نتمكن من تحميل البيانات الآن. جرّب مرة أخرى، أو ارجع إلى الصفحة الرئيسية.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-13 font-semibold text-white transition-colors hover:bg-primary-600"
          >
            <RefreshCw className="h-4 w-4" />
            المحاولة مرة أخرى
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#cbd7e4] px-5 text-13 font-semibold text-secondary-600 transition-colors hover:border-primary-300 hover:text-primary-600"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
