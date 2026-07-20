import { createClient } from '../supabase/server';
import { Request } from '@/interface';

const getEmployeeRequests = async (): Promise<Request[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};

export default getEmployeeRequests;
