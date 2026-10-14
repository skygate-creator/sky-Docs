import getAdminStatistics, {
  AdminEmployeeStatistic,
} from '../../../../lib/Helper/getAdminStatistics';
import {
  Banknote,
  ContactRound,
  Inbox,
  Share2,
} from 'lucide-react';
import StatCard from '@/_Components/StatCard/StatCard';
import AccountStatusBadge from '@/_Components/AccountStatusBadge/AccountStatusBadge';
import UserAvatar from '@/_Components/UserAvatar/UserAvatar';
import { formatCurrencyTotals } from '@/Utils/currency';
import { formatMonthYear } from '@/Utils/date';

const AdminStatisticsPage = async () => {
  const statistics = await getAdminStatistics();

  return (
    <div className="flex flex-col gap-3 p-3">
      <header className="flex flex-col gap-3 rounded-2xl border border-primary-100 bg-gradient-to-l from-primary-50 to-white p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-13 font-semibold text-primary-600">
            نظرة هذا الشهر
          </p>
          <h1 className="mt-1 text-24 font-bold text-secondary-950">
            الإحصائيات
          </h1>
          <p className="mt-1 text-13 text-secondary-400">
            ملخص العملاء والريكويستات ومبيعات الموظفين خلال الشهر الحالي.
          </p>
        </div>
        <span className="w-fit rounded-xl border border-secondary-200 bg-white px-4 py-2 text-12 font-semibold text-secondary-500 shadow-sm">
          {formatCurrentMonth()}
        </span>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="العملاء هذا الشهر"
          value={statistics.clientsCount.toLocaleString('en-US')}
          note="عميل جديد"
          icon={ContactRound}
          color="blue"
        />
        <StatCard
          label="إجمالي المبيعات"
          value={formatCurrencyTotals(statistics.salesByCurrency, '0 SAR')}
          note="مبيعات الشهر الحالي"
          icon={Banknote}
          color="green"
          compactValue
        />
        <StatCard
          label="الريكويستات هذا الشهر"
          value={statistics.requestsCount.toLocaleString('en-US')}
          note="ريكويست وصل لفريق المبيعات"
          icon={Inbox}
          color="orange"
        />
      </section>

      <section className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Share2 className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-16 font-bold text-secondary-950">
              مصادر الريكويستات
            </h2>
            <p className="text-11 text-secondary-400">
              توزيع الريكويستات خلال الشهر الحالي
            </p>
          </div>
        </div>

        {statistics.leadSources.length === 0 ?
          <p className="py-8 text-center text-13 text-secondary-400">
            لا توجد ريكويستات خلال هذا الشهر.
          </p>
        : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {statistics.leadSources.map((source) => (
              <div key={source.name} className="rounded-xl bg-secondary-50 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <strong className="text-12 text-secondary-900">
                    {source.name}
                  </strong>
                  <span className="text-11 font-semibold text-secondary-500">
                    {source.count.toLocaleString('en-US')} ريكويست
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary-100">
                  <div
                    className="h-full rounded-full bg-primary-500"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        }
      </section>

      <EmployeePerformanceTable employees={statistics.employees} />
    </div>
  );
};

const EmployeePerformanceTable = ({
  employees,
}: {
  employees: AdminEmployeeStatistic[];
}) => (
  <section className="overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm">
    <div className="border-b border-secondary-200 bg-secondary-50 px-4 py-4">
      <h2 className="text-16 font-bold text-secondary-950">أداء الموظفين</h2>
      <p className="mt-1 text-11 text-secondary-400">
        مرتب حسب إجمالي المبيعات من الأعلى إلى الأقل
      </p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-right">
        <thead>
          <tr className="border-b border-secondary-200 bg-[#f8fafc] text-11 text-secondary-500">
            <th className="px-4 py-3 font-semibold">اسم الموظف</th>
            <th className="px-4 py-3 text-center font-semibold">
              عدد الريكويستات
            </th>
            <th className="px-4 py-3 text-center font-semibold">عدد العملاء</th>
            <th className="px-4 py-3 font-semibold">إجمالي المبيعات</th>
            <th className="px-4 py-3 text-center font-semibold">حالة الحساب</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="border-b border-secondary-100 last:border-b-0"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={employee.name}
                    src={employee.avatarUrl}
                    size="sm"
                  />
                  <strong className="text-13 text-secondary-950">
                    {employee.name}
                  </strong>
                </div>
              </td>
              <td className="px-4 py-3 text-center text-13 font-semibold text-secondary-800">
                {employee.requestsCount.toLocaleString('en-US')}
              </td>
              <td className="px-4 py-3 text-center text-13 font-semibold text-secondary-800">
                {employee.clientsCount.toLocaleString('en-US')}
              </td>
              <td className="px-4 py-3 text-12 font-bold text-secondary-950">
                {formatCurrencyTotals(employee.salesByCurrency, '0 SAR')}
              </td>
              <td className="px-4 py-3 text-center">
                <AccountStatusBadge isActive={employee.isActive} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const formatCurrentMonth = () => formatMonthYear(new Date());

export default AdminStatisticsPage;
