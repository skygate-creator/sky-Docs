'use client';

import { createClient } from '../../lib/supabase/client';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface AddTripValues {
  customerId: string;
  tripPrice: number;
  currency: string;
}

const useAddTrip = () => {
  const supabase = createClient();

  return useMutation({
    mutationKey: ['add-trip'],
    mutationFn: async ({ customerId, tripPrice, currency }: AddTripValues) => {
      const { data, error } = await supabase
        .from('trips')
        .insert({
          customer_id: customerId,
          trip_price: tripPrice,
          currency,
        })
        .select('id, customer_id')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('تم إنشاء الرحلة الجديدة', { position: 'top-center' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'تعذر إنشاء الرحلة', {
        position: 'top-center',
      });
    },
  });
};

export default useAddTrip;
