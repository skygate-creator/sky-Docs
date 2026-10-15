import { createClient } from '../../lib/supabase/client';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const useEditClient = () => {
  const supabase = createClient();
  const router = useRouter();

  const addClient = async (values: {
    id: string;
    customer_name: string;
    phone: string;
  }) => {
    const { data, error } = await supabase
      .from('customers')
      .update({
        customer_name: values.customer_name,
        phone: values.phone,
      })
      .eq('id', values.id);

    if (error) throw error;
    return data;
  };

  return useMutation({
    mutationKey: ['editclient'],
    mutationFn: addClient,

    onSuccess: () => {
      toast.success('تم تعديل العميل بنجاح', {
        position: 'top-center',
      });
      router.refresh();
    },

    onError: (error: any) => {
      toast.error(error.message || 'فشل في تعديل العميل', {
        position: 'top-center',
      });
    },
  });
};

export default useEditClient;
