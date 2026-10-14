import { DispatcherEmployeeRequestCount } from '../../../lib/Helper/getDispatcherEmployeeRequestCounts';
import { formatDate } from '../../Utils/date';
import AccountStatusBadge from '../AccountStatusBadge/AccountStatusBadge';

const DispatcherEmployeeRequestsTable = ({
  employees,
}: {
  employees: DispatcherEmployeeRequestCount[];
}) => {
  const totalRequests = employees.reduce(
    (total, employee) => total + employee.requestsCount,
    0,
  );

  return (
    <section className="overflow-hidden rounded-[18px] border border-[#d4dfeb] bg-white">
      <div className="border-b border-[#d4dfeb] bg-[#e8eef5] px-4 py-3">
        <h2 className="text-16 font-bold text-secondary-950">
          الريكويستات المرسلة للموظفين
        </h2>
      </div>

      {employees.length === 0 ?
        <p className="px-4 py-8 text-center text-13 text-secondary-400">
          لم يتم إرسال ريكويستات لأي موظف حتى الآن.
        </p>
      : <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-right">
            <thead>
              <tr className="border-b border-[#d4dfeb] bg-[#f6f8fb] text-12 text-secondary-500">
                <th className="px-4 py-3 font-semibold">اسم الموظف</th>
                <th className="px-4 py-3 text-center font-semibold">
                  عدد الريكويستات
                </th>
                <th className="px-4 py-3 font-semibold">آخر ريكويست</th>
                <th className="px-4 py-3 text-center font-semibold">
                  حالة الحساب
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-[#e3e9f0] last:border-b-0"
                >
                  <td className="px-4 py-3 text-13 font-semibold text-secondary-900">
                    {employee.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-primary-50 px-3 py-1 text-12 font-bold text-primary-600">
                      {employee.requestsCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-12 text-secondary-500">
                    {formatDate(employee.lastRequestAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <AccountStatusBadge isActive={employee.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#d4dfeb] bg-[#f6f8fb]">
                <td className="px-4 py-3 text-13 font-bold text-secondary-900">
                  الإجمالي
                </td>
                <td className="px-4 py-3 text-center text-13 font-bold text-primary-600">
                  {totalRequests}
                </td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      }
    </section>
  );
};

export default DispatcherEmployeeRequestsTable;
