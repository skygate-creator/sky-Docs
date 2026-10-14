import { createClient } from '../supabase/server';

export interface AdminEmployeeStatistic {
  id: string;
  name: string;
  avatarUrl: string | null;
  isActive: boolean;
  requestsCount: number;
  clientsCount: number;
  salesByCurrency: Record<string, number>;
}

export interface AdminLeadSourceStatistic {
  name: string;
  count: number;
  percentage: number;
}

export interface AdminStatisticsData {
  clientsCount: number;
  requestsCount: number;
  salesByCurrency: Record<string, number>;
  leadSources: AdminLeadSourceStatistic[];
  employees: AdminEmployeeStatistic[];
}

const getAdminStatistics = async (): Promise<AdminStatisticsData> => {
  const supabase = await createClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const rangeStart = startOfMonth.toISOString();
  const rangeEnd = startOfNextMonth.toISOString();

  const [employeesResult, requestsResult, clientsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, name, avatar_url, is_active')
      .eq('role', 'employee'),
    supabase
      .from('requests')
      .select('employee_id, lead_source')
      .gte('created_at', rangeStart)
      .lt('created_at', rangeEnd),
    supabase
      .from('clients')
      .select('employee_id, trip_price, currency')
      .gte('created_at', rangeStart)
      .lt('created_at', rangeEnd),
  ]);

  const failedResult = [employeesResult, requestsResult, clientsResult].find(
    (result) => result.error,
  );

  if (failedResult?.error) throw failedResult.error;

  const requests = requestsResult.data ?? [];
  const clients = clientsResult.data ?? [];
  const salesByCurrency: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};
  const employees = new Map<string, AdminEmployeeStatistic>();

  for (const employee of employeesResult.data ?? []) {
    employees.set(employee.id, {
      id: employee.id,
      name: employee.name,
      avatarUrl: employee.avatar_url,
      isActive: employee.is_active,
      requestsCount: 0,
      clientsCount: 0,
      salesByCurrency: {},
    });
  }

  for (const request of requests) {
    const employee = employees.get(request.employee_id);
    if (employee) employee.requestsCount += 1;

    const source = request.lead_source?.trim() || 'غير محدد';
    sourceCounts[source] = (sourceCounts[source] ?? 0) + 1;
  }

  for (const client of clients) {
    const employee = employees.get(client.employee_id);
    const currency = client.currency?.trim() || '—';
    const price = Number(client.trip_price ?? 0);

    salesByCurrency[currency] = (salesByCurrency[currency] ?? 0) + price;

    if (employee) {
      employee.clientsCount += 1;
      employee.salesByCurrency[currency] =
        (employee.salesByCurrency[currency] ?? 0) + price;
    }
  }

  const leadSources = Object.entries(sourceCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: requests.length === 0 ? 0 : (count / requests.length) * 100,
    }))
    .sort((first, second) => second.count - first.count);

  const employeeStatistics = [...employees.values()].sort((first, second) => {
    const salesDifference =
      getSalesSortValue(second.salesByCurrency) -
      getSalesSortValue(first.salesByCurrency);

    return (
      salesDifference ||
      second.clientsCount - first.clientsCount ||
      second.requestsCount - first.requestsCount
    );
  });

  return {
    clientsCount: clients.length,
    requestsCount: requests.length,
    salesByCurrency,
    leadSources,
    employees: employeeStatistics,
  };
};

const getSalesSortValue = (sales: Record<string, number>) =>
  sales.SAR ?? Object.values(sales).reduce((total, value) => total + value, 0);

export default getAdminStatistics;
