import { AddClientForm } from '@/interface';
import { createClient } from '../../lib/supabase/client';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useAddClient = () => {
  const supabase = createClient();
  const addClient = async (values: AddClientForm) => {
    const { data, error } = await supabase
      .rpc('create_customer_with_first_trip', {
        p_customer_name: values.customer_name,
        p_phone: values.phone,
        p_trip_price: values.trip_price,
        p_currency: values.currency,
      })
      .single();

    if (error) throw error;

    return data as {
      customer_id: string;
      trip_id: string;
      customer_code: string;
    };
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
      const message =
        error?.code === '23505'
          ? 'هذا العميل مسجل بالفعل. افتح صفحة العملاء وأضف رحلة جديدة من ملفه.'
          : error.message || 'فشل في إضافة العميل';
      toast.error(message, {
        position: 'top-center',
      });
    },
  });
};

export default useAddClient;
