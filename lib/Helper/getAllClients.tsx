// lib/Helper/getAllClients.ts
import { createClient } from '../supabase/server';
import { mapCustomer } from './mapCustomer';

const getAllClients = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('customers')
    .select(
      `
      id,
      customer_code,
      employee_id,
      customer_name,
      phone,
      created_at,
      updated_at,
      profiles:employee_id (
        name
      ),
      trips (*),
      customer_files (passport_path)
    `,
    )
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((customer) => mapCustomer(customer as never));
};

export default getAllClients;
