import {
  Banknote,
  ContactRound,
  Inbox,
  UsersRound,
} from 'lucide-react';
import getAdminDashboardData from '../../../../lib/Helper/getAdminDashboardData';
import getUserProfile from '../../../../lib/Helper/getUserProfile';
import AdminRecintClients from '@/_Components/Admin_components/AdminRecentClients/AdminRecintClients';
import StatCard from '@/_Components/StatCard/StatCard';
import { formatCurrencyTotals } from '@/Utils/currency';

const dashboard = async () => {
  const [dashboardData, user] = await Promise.all([
    getAdminDashboardData(),
    getUserProfile(),
  ]);

  const totalTrips = formatCurrencyTotals(dashboardData.totalsByCurrency);

  return (
    <div className="flex flex-col gap-3 p-3">
      <section className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-gradient-to-l from-primary-50 to-white p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-13 font-semibold text-primary-600">نظرة عامة</p>
          <h1 className="mt-1 text-24 font-bold text-secondary-950">
            مرحبًا بعودتك، {user?.name?.split(' ')[0] ?? 'مدير النظام'}
          </h1>
          <p className="mt-1 text-14 text-secondary-400">
            تابع أداء الفريق والعملاء من مكان واحد
          </p>
        </div>
        <span className="w-fit rounded-xl border border-secondary-200 bg-white px-4 py-2 text-12 font-semibold text-secondary-500 shadow-sm">
          إحصائيات هذا الشهر
        </span>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="عدد الموظفين"
          value={dashboardData.employeesCount.toLocaleString('en-US')}
          note="موظف مسجل في النظام"
          icon={UsersRound}
          color="blue"
        />
        <StatCard
          label="إجمالي العملاء"
          value={dashboardData.clientsCount.toLocaleString('en-US')}
          note="عميل لدى فريق المبيعات"
          icon={ContactRound}
          color="purple"
        />
        <StatCard
          label="ريكويستات الشهر"
          value={dashboardData.requestsCount.toLocaleString('en-US')}
          note="خلال الشهر الحالي"
          icon={Inbox}
          color="orange"
        />
        <StatCard
          label="قيمة الرحلات"
          value={totalTrips}
          note="إجمالي الرحلات المسجلة"
          icon={Banknote}
          color="green"
          compactValue
        />
      </section>

      <AdminRecintClients clients={dashboardData.recentClients} />
    </div>
  );
};

export default dashboard;
