import React from 'react';
import { createClient } from '../supabase/server';
const getUserClientsById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('employee_id', id);

  if (error) throw error;
  return data;
};

export default getUserClientsById;
