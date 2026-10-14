import getEmployeeReports from '../../../../lib/Helper/getEmployeeReports';
import getUserProfile from '../../../../lib/Helper/getUserProfile';
import RequestsTable from '@/_Components/RequestTable/RequestTable';

const requestReport = async () => {
  const [data, user] = await Promise.all([
    getEmployeeReports(),
    getUserProfile(),
  ]);

  if (!user) return null;

  return (
    <section className="flex flex-col gap-5 p-3">
      <div className="rounded-2xl border border-primary-100 bg-gradient-to-l from-primary-50 to-white p-5">
        <p className="text-13 font-semibold text-primary-600">سجل العمل</p>
        <h1 className="mt-1 text-24 font-bold text-secondary-900">
          تقارير الموظف
        </h1>
        <p className="mt-2 text-14 font-medium text-secondary-400">
          اعرض تقاريرك وأضفها أو عدّلها أو احذفها من مكان واحد
        </p>
      </div>
      <RequestsTable requests={data} employeeId={user.id} />
    </section>
  );
};

export default requestReport;
