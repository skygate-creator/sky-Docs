import { createClient } from '../supabase/server';
const getRecentClientAdded = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false }) // رتب الأول
    .limit(7); // بعدين حدد العدد

  if (error) throw error;

  return data;
};

export default getRecentClientAdded;
