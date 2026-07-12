import React from 'react';
import { createClient } from '../supabase/server';
const getUserById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export default getUserById;
