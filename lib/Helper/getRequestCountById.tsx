import { createClient } from '../supabase/server';

const getRequestCountById = async (id: string) => {
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const { count, error } = await supabase
    .from('requests')
    .select('*', { count: 'exact', head: true })
    .eq('employee_id', id)
    .gte('created_at', startOfMonth.toISOString())
    .lt('created_at', startOfNextMonth.toISOString());

  if (error) throw error;

  return count ?? 0;
};

export default getRequestCountById;
