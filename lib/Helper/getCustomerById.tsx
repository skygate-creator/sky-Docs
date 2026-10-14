import { createClient } from '../supabase/server';
import { ClientDetails } from '@/interface';

const getCustomerById = async (id: string): Promise<ClientDetails | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export default getCustomerById;
