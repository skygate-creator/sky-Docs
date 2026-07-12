// lib/Helper/getTotalTripPrice.ts
import { createClient } from '../supabase/server';

const getTotalTripPrice = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_total_trip_price');

  if (error) throw error;

  return data as number;
};

export default getTotalTripPrice;
