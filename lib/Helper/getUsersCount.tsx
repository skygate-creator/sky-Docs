import { createClient } from '../supabase/server';

const getUsersCount = async () => {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;

  return count ?? 0;
};

export default getUsersCount;
