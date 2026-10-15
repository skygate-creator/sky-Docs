import { createClient } from '../supabase/server';
import { mapCustomer } from './mapCustomer';
const getRecentClientAdded = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*, trips (*), customer_files (passport_path)')
    .order('created_at', { ascending: false }) // رتب الأول
    .limit(7); // بعدين حدد العدد

  if (error) throw error;

  return (data ?? []).map((customer) => mapCustomer(customer as never));
};

export default getRecentClientAdded;
