import { RecentClient } from '@/interface';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { formatMoney } from '@/Utils/currency';
import { formatDate } from '@/Utils/date';
import { getInitials } from '@/Utils/names';

const avatarColors = [
  'bg-primary-100 text-primary-700',
  'bg-tertiary-100 text-tertiary-600',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
];

const AdminRecintClients = ({ clients }: { clients: RecentClient[] }) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-secondary-100 px-5 py-4">
        <div>
          <h2 className="text-16 font-bold text-secondary-900">
            آخر العملاء المضافين
          </h2>
          <p className="mt-1 text-12 text-secondary-400">
            آخر تحديثات فريق المبيعات
          </p>
        </div>
        <span className="rounded-lg bg-primary-50 px-3 py-1.5 text-11 font-semibold text-primary-700">
          آخر {clients.length} عملاء
        </span>
      </div>

      {clients.length > 0 ?
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-right">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-5 py-3 text-11 font-semibold text-secondary-400">
                  العميل
                </th>
                <th className="px-5 py-3 text-11 font-semibold text-secondary-400">
                  الموظف المسؤول
                </th>
                <th className="px-5 py-3 text-11 font-semibold text-secondary-400">
                  قيمة الرحلة
                </th>
                <th className="px-5 py-3 text-11 font-semibold text-secondary-400">
                  تاريخ الإضافة
                </th>
                <th className="px-5 py-3">
                  <span className="sr-only">عرض التفاصيل</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {clients.map((client, index) => (
                <tr
                  key={client.id}
                  className="transition-colors hover:bg-primary-50/40"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-11 font-bold ${
                          avatarColors[index % avatarColors.length]
                        }`}
                      >
                        {getInitials(client.customer_name, { fallback: '—' })}
                      </span>
                      <div>
                        <p className="text-13 font-bold text-secondary-900">
                          {client.customer_name}
                        </p>
                        <p
                          className="mt-0.5 text-11 text-secondary-400"
                          dir="ltr"
                        >
                          {client.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-12 font-medium text-secondary-600">
                    {client.profiles?.name ?? '—'}
                  </td>
                  <td className="px-5 py-3.5 text-12 font-bold text-secondary-900">
                    {formatMoney(client.trip_price, client.currency)}
                  </td>
                  <td className="px-5 py-3.5 text-11 text-secondary-400">
                    {formatDate(client.created_at)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/employee/clientInfo/${client.id}`}
                      aria-label={`عرض تفاصيل ${client.customer_name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition hover:bg-primary-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      : <div className="py-14 text-center">
          <p className="text-14 font-semibold text-secondary-700">
            لا يوجد عملاء حتى الآن
          </p>
          <p className="mt-1 text-12 text-secondary-400">
            سيظهر أحدث العملاء هنا
          </p>
        </div>
      }
    </section>
  );
};

export default AdminRecintClients;
