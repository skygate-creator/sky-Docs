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

export const useUploadClientDocs = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ['upload-client-docs'],
    mutationFn: ({ values, employeeId }: UploadClientDocsParams) =>
      saveClientDocuments(values, employeeId),
    onSuccess: (_data, variables) => {
      toast.success('تم حفظ جواز العميل ومستندات الرحلة', {
        position: 'top-center',
      });
      router.replace(
        `/employee/customerInfo/${variables.values.customer_id}?trip=${variables.values.trip_id}`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في تحميل المستندات', {
        position: 'top-center',
      });
    },
  });
};
