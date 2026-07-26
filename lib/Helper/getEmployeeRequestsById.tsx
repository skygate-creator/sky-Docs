import { createClient } from '../supabase/server';
import { Request } from '@/interface';

const getEmployeeRequestsById = async (id: string): Promise<Request[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false })
    .eq('employee_id', id);

  if (error) throw error;

  return data;
};

export default getEmployeeRequestsById;
