import { createClient } from '../supabase/server';
import { ClientDetails } from '@/interface';
import { mapCustomerDetails } from './mapCustomer';

const getCustomerById = async (id: string): Promise<ClientDetails | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*, trips (*), customer_files (passport_path)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapCustomerDetails(data as never) : null;
};

export default getCustomerById;
