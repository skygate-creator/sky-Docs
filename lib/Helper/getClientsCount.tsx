import { createClient } from '../supabase/server';

const getClientsCount = async () => {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;

  return count ?? 0;
};

export default getClientsCount;
