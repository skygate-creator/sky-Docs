import { Request } from '@/interface';
import { createClient } from '../../lib/supabase/client';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const useAddRequest = () => {
  const supabase = createClient();
  const router = useRouter();

  const addClient = async (values: Request) => {
    const { data, error } = await supabase.from('requests').insert({
      employee_id: values.employee_id,
      phone: values.phone,
      destination: values.destination,
      trip_type: values.trip_type,
      passengers: values.passengers,
      departure_airport: values.departure_airport,
      arrival_airport: values.arrival_airport,
      lead_source: values.lead_source,
      customer_notes: values.customer_notes,
    });

    if (error) throw error;

    return data;
  };

  return useMutation({
    mutationKey: ['addrequest'],
    mutationFn: addClient,

    onSuccess: (data) => {
      toast.success('تم إضافة الطلب بنجاح', {
        position: 'top-center',
      });
    },

    onError: (error: any) => {
      toast.error(error.message || 'فشل في إضافة الطلب', {
        position: 'top-center',
      });
    },
  });
};

export default useAddRequest;
