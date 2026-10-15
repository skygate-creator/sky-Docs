import { createClient } from '../supabase/server';
const getClientDocs = async (tripId: string, customerId: string) => {
  const supabase = await createClient();
  const [tripFilesResult, customerFilesResult] = await Promise.all([
    supabase.from('trip_files').select('*').eq('trip_id', tripId).maybeSingle(),
    supabase
      .from('customer_files')
      .select('*')
      .eq('customer_id', customerId)
      .maybeSingle(),
  ]);

  if (tripFilesResult.error) throw tripFilesResult.error;
  if (customerFilesResult.error) throw customerFilesResult.error;

  if (!tripFilesResult.data && !customerFilesResult.data) return [];

  return [
    {
      ...(tripFilesResult.data ?? {}),
      passport_path: customerFilesResult.data?.passport_path ?? null,
    },
  ];
};

export default getClientDocs;
