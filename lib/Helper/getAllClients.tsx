// lib/Helper/getAllClients.ts
import { createClient } from '../supabase/server';

const getAllClients = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select(
      `
      *,
      profiles:employee_id (
        name
      )
    `,
    )
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export default getAllClients;
