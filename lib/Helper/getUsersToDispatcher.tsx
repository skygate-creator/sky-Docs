import { createClient } from '../supabase/server';
import { UserDispatcher } from '@/interface';

const getUsersToDispatcher = async (): Promise<UserDispatcher[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    'get_dispatcher_employee_directory',
  );

  if (error) throw error;

  return (data as { employee_id: string; employee_name: string }[]).map(
    (employee) => ({
      id: employee.employee_id,
      name: employee.employee_name,
    }),
  );
};

export default getUsersToDispatcher;
