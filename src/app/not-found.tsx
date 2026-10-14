import Link from 'next/link';
import { ArrowRight, FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-[1300px] items-center justify-center p-3">
      <section className="w-full max-w-lg rounded-[22px] border border-[#d4dfeb] bg-white p-6 text-center shadow-[0_14px_40px_rgba(54,74,104,0.08)] sm:p-9">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary-50 text-primary-500">
          <FileQuestion className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-24 font-bold text-secondary-950">
          الصفحة غير موجودة
        </h1>
        <p className="mt-2 text-13 leading-7 text-secondary-500">
          الرابط غير صحيح أو أن السجل المطلوب لم يعد متاحًا لك.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-13 font-semibold text-white transition-colors hover:bg-primary-600"
        >
          العودة إلى الصفحة الرئيسية
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
};

export default NotFound;
