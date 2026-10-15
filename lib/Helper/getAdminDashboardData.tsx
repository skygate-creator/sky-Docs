import { createClient } from '../supabase/server';
import { mapCustomer } from './mapCustomer';

const getAdminDashboardData = async () => {
  const supabase = await createClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [
    employeesResult,
    clientsResult,
    requestsResult,
    recentClientsResult,
    tripValuesResult,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'employee'),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())
      .lt('created_at', startOfNextMonth.toISOString()),
    supabase
      .from('customers')
      .select(
        `
          id,
          customer_code,
          customer_name,
          phone,
          employee_id,
          created_at,
          updated_at,
          trips (*),
          customer_files (passport_path),
          profiles:employee_id (name)
        `,
      )
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('trips').select('trip_price, currency'),
  ]);

  const results = [
    employeesResult,
    clientsResult,
    requestsResult,
    recentClientsResult,
    tripValuesResult,
  ];
  const failedResult = results.find((result) => result.error);

  if (failedResult?.error) throw failedResult.error;

  const totalsByCurrency = (tripValuesResult.data ?? []).reduce<
    Record<string, number>
  >((totals, client) => {
    const currency = client.currency || '—';
    totals[currency] = (totals[currency] ?? 0) + Number(client.trip_price ?? 0);
    return totals;
  }, {});

  const recentClients = (recentClientsResult.data ?? []).map((client) =>
    mapCustomer({
      ...client,
      profiles:
        Array.isArray(client.profiles) ? client.profiles[0] : client.profiles,
    } as never),
  );
  return {
    employeesCount: employeesResult.count ?? 0,
    clientsCount: clientsResult.count ?? 0,
    requestsCount: requestsResult.count ?? 0,
    recentClients,
    totalsByCurrency,
  };
};

export default getAdminDashboardData;
