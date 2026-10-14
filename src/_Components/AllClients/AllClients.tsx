'use client';

import { RecentClient } from '@/interface';
import { ArrowUpLeft, Pencil, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { formatMoney } from '@/Utils/currency';
import { formatLongDate } from '@/Utils/date';
import { getInitials } from '@/Utils/names';

type SortOrder = 'newest' | 'oldest';

const getCreatedAt = (client: RecentClient) => {
  if (!client.created_at) return 0;

  const createdAt = new Date(client.created_at).getTime();
  return Number.isNaN(createdAt) ? 0 : createdAt;
};

const AllClintes = ({ clients }: { clients: RecentClient[] }) => {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedId, setSelectedId] = useState<string | undefined>(
    clients[0]?.id,
  );

  const filteredClients = useMemo(() => {
    const searchValue = search.trim().toLocaleLowerCase('ar');
    const matchingClients = clients.filter((client) => {
      if (!searchValue) return true;

      return (
        client.customer_name.toLocaleLowerCase('ar').includes(searchValue) ||
        client.phone.includes(searchValue)
      );
    });

    return matchingClients.sort((firstClient, secondClient) => {
      const difference = getCreatedAt(firstClient) - getCreatedAt(secondClient);
      return sortOrder === 'newest' ? -difference : difference;
    });
  }, [clients, search, sortOrder]);

  const selectedClient =
    filteredClients.find((client) => client.id === selectedId) ??
    filteredClients[0];

  return (
    <section className="w-full pb-8">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <label className="relative block">
          <span className="sr-only">البحث بالاسم أو رقم الهاتف</span>
          <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75849a]" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث بالاسم أو رقم الهاتف"
            className="h-12 w-full rounded-xl border border-[#cbd7e4] bg-white py-2 pl-4 pr-11 text-14 text-secondary-950 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
          />
        </label>

        <div
          className="grid grid-cols-2 rounded-xl border border-[#cbd7e4] bg-[#e4ebf3] p-1"
          aria-label="ترتيب العملاء"
        >
          {([
            ['newest', 'الأحدث'],
            ['oldest', 'الأقدم'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={sortOrder === value}
              onClick={() => setSortOrder(value)}
              className={`min-h-10 min-w-24 rounded-lg px-5 text-13 font-semibold transition-colors ${
                sortOrder === value ?
                  'bg-white text-primary-600 shadow-sm'
                : 'text-secondary-500 hover:text-secondary-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.3fr)]">
        <div className="overflow-hidden rounded-[18px] border border-[#d4dfeb] bg-[#e8eef5]">
          <div className="flex items-center justify-between border-b border-[#d4dfeb] px-5 py-4">
            <h2 className="text-16 font-bold text-secondary-950">العملاء</h2>
            <span className="rounded-full bg-white px-3 py-1 text-11 font-medium text-secondary-500">
              {filteredClients.length} عميل
            </span>
          </div>

          <div className="max-h-[570px] overflow-y-auto">
            {filteredClients.length === 0 ?
              <p className="px-5 py-14 text-center text-13 text-secondary-400">
                لا يوجد عملاء مطابقون للبحث
              </p>
            : filteredClients.map((client) => {
                const isSelected = client.id === selectedClient?.id;

                return (
                  <button
                    key={client.id ?? `${client.customer_name}-${client.phone}`}
                    type="button"
                    onClick={() => setSelectedId(client.id)}
                    className={`flex w-full items-center justify-between gap-3 border-t border-[#d4dfeb] px-4 py-4 text-right transition-colors first:border-t-0 ${
                      isSelected ?
                        'bg-primary-500 shadow-sm'
                      : 'hover:bg-white/60'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] text-12 font-bold ${
                          isSelected ?
                            'bg-white/20 text-white'
                          : 'bg-[#eef3fb] text-[#526b98]'
                        }`}
                      >
                        {getInitials(client.customer_name)}
                      </span>
                      <span className="min-w-0">
                        <strong
                          className={`block truncate text-13 ${
                            isSelected ? 'text-white' : 'text-secondary-950'
                          }`}
                        >
                          {client.customer_name}
                        </strong>
                        <span
                          dir="ltr"
                          className={`block text-right text-11 ${
                            isSelected ? 'text-white/75' : 'text-secondary-400'
                          }`}
                        >
                          {client.phone}
                        </span>
                      </span>
                    </span>
                    <strong
                      className={`shrink-0 text-12 ${
                        isSelected ? 'text-white' : 'text-secondary-800'
                      }`}
                    >
                      {formatMoney(client.trip_price, client.currency)}
                    </strong>
                  </button>
                );
              })
            }
          </div>
        </div>

        <div className="min-h-72 rounded-[18px] border border-[#d4dfeb] bg-[#e8eef5] p-5 md:p-6">
          {!selectedClient ?
            <div className="flex min-h-60 items-center justify-center text-13 text-secondary-400">
              اختر عميلًا لعرض التفاصيل
            </div>
          : <>
              <div className="flex items-start justify-between gap-4 border-b border-[#d1dce8] pb-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-white text-14 font-bold text-[#526b98]">
                    {getInitials(selectedClient.customer_name)}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-18 font-bold text-secondary-950">
                      {selectedClient.customer_name}
                    </h2>
                    <p dir="ltr" className="text-right text-12 text-secondary-400">
                      {selectedClient.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#dce5ef] p-4">
                  <span className="block text-11 text-secondary-400">
                    إجمالي الرحلة
                  </span>
                  <strong className="mt-1 block text-14 text-secondary-950">
                    {formatMoney(
                      selectedClient.trip_price,
                      selectedClient.currency,
                    )}
                  </strong>
                </div>
                <div className="rounded-xl bg-[#dce5ef] p-4">
                  <span className="block text-11 text-secondary-400">
                    تاريخ الإضافة
                  </span>
                  <strong className="mt-1 block text-14 text-secondary-950">
                    {formatLongDate(selectedClient.created_at)}
                  </strong>
                </div>
                <div className="rounded-xl bg-[#dce5ef] p-4">
                  <span className="block text-11 text-secondary-400">العملة</span>
                  <strong className="mt-1 block text-14 text-secondary-950">
                    {selectedClient.currency}
                  </strong>
                </div>
                <div className="rounded-xl bg-[#dce5ef] p-4">
                  <span className="block text-11 text-secondary-400">
                    رقم الهاتف
                  </span>
                  <strong
                    dir="ltr"
                    className="mt-1 block text-right text-14 text-secondary-950"
                  >
                    {selectedClient.phone}
                  </strong>
                </div>
              </div>

              {selectedClient.id && (
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={`/employee/customerInfo/${selectedClient.id}`}
                    className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-13 font-semibold text-white transition-colors hover:bg-primary-600"
                  >
                    فتح الملف الكامل
                    <ArrowUpLeft className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/employee/customer/EditCustomer/${selectedClient.id}`}
                    className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#cbd7e4] bg-white px-5 text-13 font-semibold text-secondary-700 transition-colors hover:border-primary-300 hover:text-primary-600"
                  >
                    تعديل البيانات
                    <Pencil className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          }
        </div>
      </div>
    </section>
  );
};

export default AllClintes;
