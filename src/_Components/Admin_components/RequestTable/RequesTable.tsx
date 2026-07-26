'use client';

import { Request } from '@/interface';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useState } from 'react';
import EmployeeRequestCard from '../EmployeeRequestCard/EmployeeRequestCard';

const RequestsTable = ({ requests }: { requests: Request[] }) => {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  return (
    <div className="w-full bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <table className="w-full text-right">
        <thead className="bg-neutral-200 border-b border-neutral-200">
          <tr>
            <th className="text-13 font-bold text-neutral-500 px-5 py-3 text-center">
              رقم الهاتف
            </th>
            <th className="text-13 font-bold text-neutral-500 px-5 py-3 text-center">
              الدولة
            </th>
            <th className="text-13 font-bold text-neutral-500 px-5 py-3 text-center">
              تاريخ الطلب
            </th>
            <th className="text-13 font-bold text-neutral-500 px-5 py-3 text-center">
              التوقيت
            </th>
            <th className="text-13 font-bold text-neutral-500 px-5 py-3 text-center">
              الإجراء
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {requests.length === 0 ?
            <tr>
              <td
                colSpan={5}
                className="text-center text-sm text-neutral-500 py-10"
              >
                لا توجد طلبات
              </td>
            </tr>
          : requests.map((req) => (
              <tr key={req.id}>
                <td className="text-14 text-secondary-700 px-5 py-4 text-center">
                  {req.phone}
                </td>
                <td className="text-14 text-secondary-700 px-5 py-4 text-center">
                  {req.destination}
                </td>
                <td className="text-14 text-secondary-700 px-5 py-4 text-center">
                  {req.created_at &&
                    format(new Date(req.created_at), 'd MMMM yyyy', {
                      locale: ar,
                    })}
                </td>
                <td className="text-14 text-secondary-700 px-5 py-4 text-center">
                  {req.created_at &&
                    format(new Date(req.created_at), 'hh:mm a', {
                      locale: ar,
                    })}
                </td>
                <td
                  onClick={() => setSelectedRequest(req)}
                  className="px-5 py-4 text-center text-14 text-primary-600 cursor-pointer hover:underline"
                >
                  عرض التفاصيل
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {selectedRequest && (
        <EmployeeRequestCard
          request={selectedRequest}
          setIsOpen={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default RequestsTable;
