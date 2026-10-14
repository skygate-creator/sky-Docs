import { createClient } from '../supabase/server';
import { Profile } from '@/interface';

const getUserById = async (id: string): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export default getUserById;
