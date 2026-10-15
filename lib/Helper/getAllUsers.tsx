import { createClient } from '../supabase/server';
import { EmployeeDirectoryItem, Profile } from '@/interface';

const getAllUsers = async (): Promise<EmployeeDirectoryItem[]> => {
  const supabase = await createClient();

  const [profilesResult, clientsResult, requestsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('role', 'employee')
      .order('created_at', { ascending: false }),
    supabase.from('customers').select('employee_id'),
    supabase.from('requests').select('employee_id'),
  ]);

  if (profilesResult.error) throw profilesResult.error;
  if (clientsResult.error) throw clientsResult.error;
  if (requestsResult.error) throw requestsResult.error;

  const clientsCount = countByEmployee(clientsResult.data);
  const requestsCount = countByEmployee(requestsResult.data);

  return (profilesResult.data as Profile[]).map((profile) => ({
    ...profile,
    clients_count: clientsCount.get(profile.id) ?? 0,
    requests_count: requestsCount.get(profile.id) ?? 0,
  }));
};

const countByEmployee = (rows: { employee_id: string }[]) => {
  const counts = new Map<string, number>();

  rows.forEach(({ employee_id }) => {
    counts.set(employee_id, (counts.get(employee_id) ?? 0) + 1);
  });

  return counts;
};

export default getAllUsers;
