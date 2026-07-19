// hooks/useUploadClientDocs.ts
'use client';

import { useMutation } from '@tanstack/react-query';
import { createClient } from '../../lib/supabase/client';
import { ClientDocsFormValues } from '@/interface';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const BUCKET_NAME = 'documents'; // غيّرها لاسم الـ bucket الفعلي عندك

const fileFields = [
  'flight_path',
  'voucher_path',
  'car_path',
  'package_path',
  'passport_path',
  'inside_flight_path',
  'supplier_info_path',
  'customer_transfers_path',
] as const;

type FileField = (typeof fileFields)[number];

interface UploadClientDocsParams {
  values: ClientDocsFormValues;
  employeeId: string;
}

export const useUploadClientDocs = () => {
  const router = useRouter();
  const uploadClientDocsFn = async ({
    values,
    employeeId,
  }: UploadClientDocsParams) => {
    const supabase = createClient();

    const uploadedPaths: Record<FileField, string | null> = {
      flight_path: null,
      voucher_path: null,
      car_path: null,
      package_path: null,
      inside_flight_path: null,
      supplier_info_path: null,
      customer_transfers_path: null,
      passport_path: null,
    };

    // 1. ارفع كل ملف موجود على الـ bucket جوه فولدر الموظف
    for (const field of fileFields) {
      const file = values[field];
      if (!file) continue;

      const filePath = `${employeeId}/${values.client_id}/${field}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
        });

      if (uploadError) throw uploadError;

      // الباكت برايفت، فبنخزن الـ path بس مش رابط
      // وبنولد signed URL وقت العرض بس (useSignedFileUrl)
      uploadedPaths[field] = filePath;
    }

    // 2. سجّل الـ paths في جدول documents
    const { error: dbError } = await supabase.from('documents').upsert(
      {
        client_id: values.client_id,
        flight_path: uploadedPaths.flight_path,
        voucher_path: uploadedPaths.voucher_path,
        car_path: uploadedPaths.car_path,
        package_path: uploadedPaths.package_path,
        inside_flight_path: uploadedPaths.inside_flight_path,
        supplier_info_path: uploadedPaths.supplier_info_path,
        customer_transfers_path: uploadedPaths.customer_transfers_path,
        passport_path: uploadedPaths.passport_path,
        notes: values.notes,
      },
      { onConflict: 'client_id' },
    );

    if (dbError) throw dbError;

    return uploadedPaths;
  };

  return useMutation({
    mutationKey: ['uploadclientdocs'],
    mutationFn: uploadClientDocsFn,
    onSuccess: () => {
      toast.success('تم تحميل المستندات بنجاح', { position: 'top-center' });
      router.replace('/employee/customer');
    },
    onError: (error: any) => {
      toast.error(error.message || 'فشل في تحميل المستندات', {
        position: 'top-center',
      });
    },
  });
};
