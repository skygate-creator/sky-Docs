import React from 'react';
import { createClient } from '../supabase/server';
const getCustomerById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export default getCustomerById;
