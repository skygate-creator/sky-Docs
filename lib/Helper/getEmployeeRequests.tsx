import { createClient } from '../supabase/server';
import { Request } from '@/interface';

const getEmployeeRequests = async (): Promise<Request[]> => {
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .gte('created_at', startOfMonth.toISOString())
    .lt('created_at', startOfNextMonth.toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};

export default getEmployeeRequests;
