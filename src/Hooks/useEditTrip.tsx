'use client';

import { createClient } from '../../lib/supabase/client';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface EditTripValues {
  id: string;
  trip_price: number;
  currency: string;
}

const useEditTrip = () => {
  const supabase = createClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ['edit-trip'],
    mutationFn: async (values: EditTripValues) => {
      const { error } = await supabase
        .from('trips')
        .update({ trip_price: values.trip_price, currency: values.currency })
        .eq('id', values.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('تم تعديل بيانات الرحلة', { position: 'top-center' });
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'تعذر تعديل الرحلة', { position: 'top-center' });
    },
  });
};

export default useEditTrip;
