'use client';

import { Request } from '@/interface';
import { formatDate } from '../../Utils/formatData';

interface RequestsTableProps {
  requests: Request[];
}

const RequestsTable = ({ requests }: RequestsTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-secondary-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-secondary-200">
            <tr>
              <th className="px-5 py-4 text-right text-14 font-semibold text-secondary-700">
                الوجهة
              </th>

              <th className="px-5 py-4 text-right text-14 font-semibold text-secondary-700">
                نوع الرحلة
              </th>

              <th className="px-5 py-4 text-right text-14 font-semibold text-secondary-700">
                رقم الهاتف
              </th>

              <th className="px-5 py-4 text-right text-14 font-semibold text-secondary-700">
                تاريخ الإنشاء
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request, index) => (
              <tr
                key={index}
                className="border-b border-secondary-100 transition hover:bg-secondary-50"
              >
                <td className="px-5 py-4 text-14 font-medium text-secondary-800">
                  {request.destination}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-12 font-medium text-primary-700">
                    {request.trip_type}
                  </span>
                </td>

                <td className="px-5 py-4 text-14 text-secondary-700">
                  {request.phone}
                </td>

                <td className="px-5 py-4 text-14 text-secondary-500">
                  {formatDate(request.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {requests.length === 0 && (
        <div className="py-10 text-center text-secondary-400">
          لا توجد بيانات
        </div>
      )}
    </div>
  );
};

export default RequestsTable;
