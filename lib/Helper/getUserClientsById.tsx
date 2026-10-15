import React from 'react';
import { createClient } from '../supabase/server';
import { mapCustomer } from './mapCustomer';
const getUserClientsById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*, trips (*), customer_files (passport_path)')
    .eq('employee_id', id);

  if (error) throw error;
  return (data ?? []).map((customer) => mapCustomer(customer as never));
};

export default getUserClientsById;
