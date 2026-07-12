import { createClient } from '../supabase/server';
const getClientDocs = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })
    .eq('client_id', id);

  if (error) throw error;

  return data;
};

export default getClientDocs;
