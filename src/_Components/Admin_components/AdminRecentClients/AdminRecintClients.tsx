// components/AdminRecintClients.tsx
import { RecentClient } from '@/interface';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const avatarColors = [
  { bg: 'bg-primary-100', text: 'text-primary-600' },
  { bg: 'bg-tertiary-100', text: 'text-tertiary-500' },
  { bg: 'bg-secondary-100', text: 'text-secondary-600' },
];

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  return parts.length > 1 ? `${parts[0][0]} ${parts[1][0]}` : parts[0][0];
};

const formatPrice = (price: number, currency: string) => {
  return `${price.toLocaleString('en-US')} ${currency}`;
};

const AdminRecintClients = ({ clients }: { clients: RecentClient[] }) => {
  return (
    <div className="w-full bg-white mb-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 py-2">
        <h3 className="font-bold text-secondary-900">آخر العملاء المضافون</h3>
      </div>

      {/* Rows */}
      <div className="divide-y divide-neutral-200 rounded-lg border-2 border-secondary-200">
        {clients.map((client, index) => {
          const color = avatarColors[index % avatarColors.length];
          return (
            <div
              key={client.id}
              className="grid grid-cols-[1fr_1fr_1fr_auto] items-start gap-4 px-5 py-4"
            >
              {/* 1. Client info (rightmost) */}
              <div className="flex items-center gap-3 justify-self-start ">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color.bg} ${color.text} text-sm font-bold`}
                >
                  {getInitials(client.customer_name)}
                </div>
                <div className="text-right">
                  <p className="font-bold text-secondary-900">
                    {client.customer_name}
                  </p>
                  <p className="text-sm text-secondary-600">{client.phone}</p>
                </div>
              </div>

              {/* 2. Employee name */}
              <div className="text-right">
                <p className="text-sm text-neutral-600">اسم الموظف</p>
                <p className="font-bold text-primary-600">
                  {client.profiles?.name ?? '—'}
                </p>
              </div>

              {/* 3. Trip price */}
              <div className="text-left">
                <p className="text-sm text-neutral-600">إجمالي الرحلة</p>
                <p className="font-bold text-primary-600">
                  {formatPrice(client.trip_price, client.currency)}
                </p>
              </div>

              {/* 4. Action button (leftmost) */}
              <Link
                href={`/admin/employee/clientInfo/${client.id}`}
                className="flex items-center gap-1 rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-secondary-700 hover:bg-neutral-200 w-fit"
              >
                عرض التفاصيل
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminRecintClients;
