import { createClient } from '../supabase/server';

const getUsersToDispatcher = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from('profiles').select('id, name');

  if (error) throw error;

  return data;
};

export default getUsersToDispatcher;
