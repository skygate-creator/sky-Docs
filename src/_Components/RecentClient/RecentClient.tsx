// components/RecentClients.tsx
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

const RecentClients = ({ clients }: { clients: RecentClient[] }) => {
  return (
    <div className="w-full bg-white mb-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 py-2">
        <h3 className="font-bold text-secondary-900">آخر العملاء</h3>
        <Link
          href="/employee/customer"
          className="text-sm text-primary-600 hover:underline"
        >
          عرض الكل
        </Link>
      </div>

      {/* Rows */}
      <div className="divide-y divide-neutral-200 rounded-lg border-2 border-secondary-200">
        {clients.map((client, index) => {
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
                  href={`/employee/customerInfo/${client.id}`}
                  className="flex items-center gap-1 rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-secondary-700 hover:bg-neutral-200"
                >
                  عرض التفاصيل
                  <ChevronLeft className="h-4 w-4" />
                </Link>
                <Link
                  href={`/employee/customer/EditCustomer/${client.id}`}
                  className="flex items-center gap-1 rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-secondary-700 hover:bg-neutral-200"
                >
                  تعديل
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentClients;
