'use client';
import { ClientDetails } from '@/interface';
import { formatDate } from '../../Utils/formatData';
import { Calendar, Phone, Dot } from 'lucide-react';

const CustomerInfo = ({ client }: { client: ClientDetails }) => {
  return (
    <div className="flex justify-between items-center gap-5 p-5 border-2 border-secondary-200 rounded-lg">
      <div className="customerInfo flex flex-col gap-5">
        <h2 className="font-bold text-28">{client.customer_name}</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-secondary-400">
            <Calendar className="w-4 h-4 " />
            <p className="font-medium text-16">
              {formatDate(client.created_at)}
            </p>
          </div>
          <Dot className="w-7 h-7 text-secondary-400" />
          <div className="flex items-center gap-1 text-secondary-400">
            <Phone className="w-4 h-4 " />
            <p className="font-medium text-16">{client.phone}</p>
          </div>
        </div>
      </div>
      <div className="price p-2 bg-primary-100 text-primary-500 rounded-lg flex flex-col gap-2 border border-primary-200">
        <h3 className="font-medium text-20 ">إجمالي السعر</h3>
        <p className="font-medium text-20 text-center">
          <span className="font-bold">{client.trip_price}</span>{' '}
          {client.currency}
        </p>
      </div>
    </div>
  );
};

export default CustomerInfo;
