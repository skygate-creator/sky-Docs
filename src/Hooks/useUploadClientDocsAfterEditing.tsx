'use client';

import { useMutation } from '@tanstack/react-query';
import { ClientDocsFormValues } from '@/interface';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { saveClientDocuments } from './saveClientDocuments';

interface UploadClientDocsParams {
  values: ClientDocsFormValues;
  employeeId: string;
}

export const useUploadClientDocsAfterEditing = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ['edit-client-docs'],
    mutationFn: ({ values, employeeId }: UploadClientDocsParams) =>
      saveClientDocuments(values, employeeId),
    onSuccess: () => {
      toast.success('تم حفظ المستندات وحذف النسخ المستبدلة', {
        position: 'top-center',
      });
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في تحميل المستندات', {
        position: 'top-center',
      });
    },
  });
};
