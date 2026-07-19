import { AddClientForm } from '@/interface';
import { createClient } from '../../lib/supabase/client';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const useAddClient = () => {
  const supabase = createClient();
  const router = useRouter();

  const addClient = async (values: AddClientForm) => {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        customer_name: values.customer_name,
        phone: values.phone,
        trip_price: values.trip_price,
        currency: values.currency,
      })
      .select('id')
      .single();

    if (error) throw error;

    return data; // { id: ... }
  };

  return useMutation({
    mutationKey: ['addclient'],
    mutationFn: addClient,

    onSuccess: (data) => {
      toast.success('تم إضافة العميل بنجاح', {
        position: 'top-center',
      });
    },

    onError: (error: any) => {
      toast.error(error.message || 'فشل في إضافة العميل', {
        position: 'top-center',
      });
    },
  });
};

export default useAddClient;
