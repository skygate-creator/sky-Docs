import { AddClientForm, RecentClient } from '@/interface';
import { createClient } from '../../lib/supabase/client';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const useEditClient = () => {
  const supabase = createClient();
  const router = useRouter();

  const addClient = async (values: RecentClient) => {
    const { data, error } = await supabase
      .from('clients')
      .update({
        customer_name: values.customer_name,
        phone: values.phone,
        trip_price: values.trip_price,
        currency: values.currency,
      })
      .eq('id', values.id);

    if (error) throw error;
    return data;
  };

  return useMutation({
    mutationKey: ['editclient'],
    mutationFn: addClient,

    onSuccess: (data) => {
      toast.success('تم تعديل العميل بنجاح', {
        position: 'top-center',
      });
    },

    onError: (error: any) => {
      toast.error(error.message || 'فشل في تعديل العميل', {
        position: 'top-center',
      });
    },
  });
};

export default useEditClient;
