import getEmployeeReports from '../../../../lib/Helper/getEmployeeReports';
import RequestsTable from '@/_Components/RequestTable/RequestTable';

const requestReport = async () => {
  const data = await getEmployeeReports();

  return (
    <section className="p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-24 font-bold text-secondary-900">تقارير الموظف</h2>

        <p className="text-16 font-medium text-secondary-400">
          جميع الطلبات المقبولة تظهر هنا
        </p>
      </div>
      <RequestsTable requests={data} />
    </section>
  );
};

export default requestReport;
