// components/RecentClients.tsx
import { RecentClient } from '@/interface';
import { ArrowUpLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { formatMoney } from '@/Utils/currency';
import { getInitials } from '@/Utils/names';

const RecentClients = ({ clients }: { clients: RecentClient[] }) => {
  return (
    <section className="mb-5 w-full">
      <div className="flex items-center justify-between border-b-2 border-[#d6e0eb] pb-3">
        <h2 className="text-18 font-bold text-secondary-950">آخر العملاء</h2>
        <Link
          href="/employee/customer"
          className="flex min-h-10 items-center gap-1.5 text-13 font-semibold text-primary-500 hover:text-primary-600"
        >
          عرض الكل
          <ArrowUpLeft className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-3 divide-y divide-[#d9e2ec] rounded-[16px] border border-[#d6e0eb] bg-[#e8eef5] px-4 md:px-5">
        {clients.length === 0 ?
          <p className="py-10 text-center text-13 text-secondary-400">
            لا يوجد عملاء مضافون حتى الآن
          </p>
        : clients.map((client) => {
            return (
              <div
                key={client.id}
                className="grid grid-cols-1 items-center gap-4 py-5 sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_auto]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#eef3fb] text-12 font-bold text-[#526b98]">
                    {getInitials(client.customer_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-13 font-bold text-secondary-950">
                      {client.customer_name}
                    </p>
                    <p className="text-11 text-secondary-400">
                      {client.phone}
                    </p>
                  </div>
                </div>

                <p className="text-14 font-bold text-secondary-950 sm:text-left">
                  {formatMoney(client.trip_price, client.currency)}
                </p>

                <div className="flex flex-wrap items-center gap-2 sm:col-span-2 lg:col-span-1">
                  <Link
                    href={`/employee/customerInfo/${client.id}`}
                    className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#dce5ef] px-4 text-12 font-medium text-secondary-700 transition-colors hover:bg-primary-100 hover:text-primary-600 lg:flex-none"
                  >
                    فتح الملف
                    <ArrowUpLeft className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/employee/customer/EditCustomer/${client.id}`}
                    className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#cbd7e4] bg-white/80 px-4 text-12 font-medium text-secondary-700 transition-colors hover:border-primary-300 hover:bg-white hover:text-primary-600 lg:flex-none"
                  >
                    تعديل
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default RecentClients;
