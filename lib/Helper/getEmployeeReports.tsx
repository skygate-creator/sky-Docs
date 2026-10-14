import { createClient } from '../supabase/server';

const getEmployeeReports = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('request_reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};

export default getEmployeeReports;
