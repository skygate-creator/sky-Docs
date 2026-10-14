import { ClientDetails } from '@/interface';
import { formatDate } from '../../Utils/date';
import { formatMoney } from '../../Utils/currency';
import { getInitials } from '../../Utils/names';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

const CustomerInfo = ({
  client,
  documentsCount,
  editHref,
}: {
  client: ClientDetails;
  documentsCount?: number;
  editHref?: string;
}) => {
  return (
    <section
      className={`grid items-center gap-4 rounded-[18px] border border-[#d4dfeb] bg-[#e8eef5] p-5 shadow-[0_10px_30px_rgba(54,74,104,0.04)] ${
        editHref ?
          'lg:grid-cols-[minmax(220px,1fr)_minmax(360px,1.35fr)_auto]'
        : 'lg:grid-cols-[minmax(220px,1fr)_minmax(360px,1.35fr)]'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[16px] bg-white text-14 font-bold text-[#526b98]">
          {getInitials(client.customer_name)}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-18 font-bold text-secondary-950">
            {client.customer_name}
          </h2>
          <p dir="ltr" className="text-right text-11 text-secondary-400">
            {client.phone}
          </p>
        </div>
      </div>

      <div
        className={`grid gap-2 ${documentsCount === undefined ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}
      >
        <div className="rounded-xl bg-[#dce5ef] px-4 py-3">
          <span className="block text-10 text-secondary-400">
            إجمالي الرحلة
          </span>
          <strong className="mt-1 block text-13 text-secondary-950">
            {formatMoney(client.trip_price, client.currency)}
          </strong>
        </div>
        <div className="rounded-xl bg-[#dce5ef] px-4 py-3">
          <span className="block text-10 text-secondary-400">
            تاريخ الإضافة
          </span>
          <strong className="mt-1 block text-13 text-secondary-950">
            {formatDate(client.created_at)}
          </strong>
        </div>
        {documentsCount !== undefined && (
          <div className="rounded-xl bg-[#dce5ef] px-4 py-3">
            <span className="block text-10 text-secondary-400">المستندات</span>
            <strong className="mt-1 block text-13 text-secondary-950">
              {documentsCount} من 8
            </strong>
          </div>
        )}
      </div>

      {editHref && (
        <Link
          href={editHref}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-13 font-bold text-white transition-colors hover:bg-primary-600"
        >
          <Pencil className="h-4 w-4" />
          تعديل الملف
        </Link>
      )}
    </section>
  );
};

export default CustomerInfo;
