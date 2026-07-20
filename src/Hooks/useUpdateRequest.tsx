import { AddClientForm, Request } from '@/interface';
import { createClient } from '../../lib/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useUpdateRequest = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const addClient = async (id: string | undefined) => {
    const { data, error } = await supabase
      .from('requests')
      .update({
        is_read: true,
      })
      .eq('id', id);

    if (error) throw error;

    return data;
  };

  return useMutation({
    mutationKey: ['updaterequest'],
    mutationFn: addClient,

    onSuccess: () => {
      toast.success('تم الإستلام بنجاح', {
        position: 'top-center',
      });

      queryClient.invalidateQueries({
        queryKey: ['requests'],
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
