import { createClient } from '../supabase/server';
import { ClientDetails, Trip } from '@/interface';
import { mapCustomerDetails } from './mapCustomer';

export interface TripWithCustomer extends Trip {
  customer: ClientDetails;
}

const getTripById = async (id: string): Promise<TripWithCustomer | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('trips')
    .select(
      '*, customer:customers!trips_customer_employee_fkey (*, trips (*), customer_files (passport_path))',
    )
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data || !data.customer) return null;

  const customer = Array.isArray(data.customer) ? data.customer[0] : data.customer;

  return {
    ...(data as unknown as Trip),
    customer: mapCustomerDetails(customer as never),
  };
};

export default getTripById;
