import { createClient } from '../supabase/server';

const getAllUsers = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'employee');

  if (error) throw error;

  return data;
};

export default getAllUsers;
