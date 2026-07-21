import { createClient } from '../../lib/supabase/client';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRequests } from '../context/RequestsContext.tsx';

const useUpdateRequest = () => {
  const supabase = createClient();
  const { markAsRead } = useRequests();

  const updateRequest = async (id: string | undefined) => {
    const { error } = await supabase
      .from('requests')
      .update({
        is_read: true,
      })
      .eq('id', id);

    if (error) throw error;

    return id;
  };

  return useMutation({
    mutationKey: ['updateRequest'],
    mutationFn: updateRequest,

    onSuccess: (id) => {
      // تحديث الـ UI فورًا
      markAsRead(id as string);

      toast.success('تم الإستلام بنجاح', {
        position: 'top-center',
      });
    },

    onError: (error: any) => {
      toast.error(error.message || 'فشل في الإستلام', {
        position: 'top-center',
      });
    },
  });
};

export default useUpdateRequest;
