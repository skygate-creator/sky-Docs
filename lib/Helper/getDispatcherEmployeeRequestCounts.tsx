import { createClient } from '../supabase/server';

export interface DispatcherEmployeeRequestCount {
  id: string;
  name: string;
  isActive: boolean;
  requestsCount: number;
  lastRequestAt: string | null;
}

interface DispatcherEmployeeRequestStatsRow {
  employee_id: string;
  employee_name: string;
  account_is_active: boolean;
  requests_count: number | string;
  last_request_at: string | null;
}

const getDispatcherEmployeeRequestCounts = async (): Promise<
  DispatcherEmployeeRequestCount[]
> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc(
    'get_dispatcher_employee_request_stats',
  );

  if (error) throw error;

  return (data as DispatcherEmployeeRequestStatsRow[]).map((employee) => ({
    id: employee.employee_id,
    name: employee.employee_name,
    isActive: employee.account_is_active,
    requestsCount: Number(employee.requests_count),
    lastRequestAt: employee.last_request_at,
  }));
};

export default getDispatcherEmployeeRequestCounts;
