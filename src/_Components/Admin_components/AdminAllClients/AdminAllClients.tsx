// components/AllClintes.tsx
'use client';

import { RecentClient } from '@/interface';
import { ChevronLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

const avatarColors = [
  { bg: 'bg-primary-100', text: 'text-primary-600' },
  { bg: 'bg-tertiary-100', text: 'text-tertiary-500' },
  { bg: 'bg-secondary-100', text: 'text-secondary-600' },
];

const DISPLAY_LIMIT = 15;

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  return parts.length > 1 ? `${parts[0][0]} ${parts[1][0]}` : parts[0][0];
};

const formatPrice = (price: number, currency: string) => {
  return `${price.toLocaleString('en-US')} ${currency}`;
};

const AdminAllClintes = ({ clients }: { clients: RecentClient[] }) => {
  const [search, setSearch] = useState('');

  const filteredClients = useMemo(() => {
    const trimmedSearch = search.trim().toLowerCase();

    // لو مفيش بحث، اعرض أول 15 بس
    if (!trimmedSearch) {
      return clients.slice(0, DISPLAY_LIMIT);
    }

    // لو فيه بحث، دور في الـ array كله من غير حد أقصى
    return clients.filter(
      (client) =>
        client.customer_name.toLowerCase().includes(trimmedSearch) ||
        client.phone.toLowerCase().includes(trimmedSearch),
    );
  }, [clients, search]);

  return (
    <div className="w-full bg-white mb-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 py-2">
        <h3 className="font-bold text-secondary-900">جميع العملاء</h3>
      </div>

      {/* Search input */}
      <div className="relative py-3">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث باسم العميل او رقم الهاتف..."
          className="w-full rounded-lg border border-neutral-300 py-2 pr-10 pl-4 text-sm outline-none focus:ring-1 focus:ring-primary-200 duration-200"
        />
      </div>

      {/* Rows */}
      <div className="divide-y divide-neutral-200 rounded-lg border-2 border-secondary-200">
        {filteredClients.length === 0 ?
          <p className="text-center text-sm text-neutral-500 py-8">
            لا يوجد عملاء مطابقين للبحث
          </p>
        : filteredClients.map((client, index) => {
            const color = avatarColors[index % avatarColors.length];
            return (
              <div
                key={client.id}
                className="flex items-center justify-between px-5 py-4"
              >
                {/* Client info (right side) */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${color.bg} ${color.text} text-sm font-bold`}
                  >
                    {getInitials(client.customer_name)}
                  </div>
                  <div>
                    <p className="font-bold text-secondary-900">
                      {client.customer_name}
                    </p>
                    <p className="text-sm text-secondary-600">{client.phone}</p>
                  </div>
                </div>

                {/* Price + button (left side) */}
                <div className="flex items-center gap-6">
                  <div className="text-left">
                    <p className="text-sm text-neutral-600">إجمالي الرحلة</p>
                    <p className="font-bold text-primary-600">
                      {formatPrice(client.trip_price, client.currency)}
                    </p>
                  </div>
                  <Link
                    href={`/admin/employee/clientInfo/${client.id}`}
                    className="flex items-center gap-1 rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-secondary-700 hover:bg-neutral-200"
                  >
                    عرض التفاصيل
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default AdminAllClintes;
