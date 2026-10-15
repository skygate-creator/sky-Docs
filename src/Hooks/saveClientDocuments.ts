import { createClient } from '../../lib/supabase/client';
import { ClientDocsFormValues } from '@/interface';
import { getSafeFileName, validatePdfFile } from '@/Utils/fileValidation';

const BUCKET_NAME = 'documents';

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

export const saveClientDocuments = async (
  values: ClientDocsFormValues,
  employeeId: string,
) => {
  const supabase = createClient();
  const storage = supabase.storage.from(BUCKET_NAME);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.id !== employeeId) {
    throw new Error('تعذر التحقق من هوية الموظف');
  }

  const [tripResult, customerFilesResult, tripFilesResult] = await Promise.all([
    supabase
      .from('trips')
      .select('id, customer_id, employee_id')
      .eq('id', values.trip_id)
      .eq('customer_id', values.customer_id)
      .maybeSingle(),
    supabase
      .from('customer_files')
      .select('passport_path')
      .eq('customer_id', values.customer_id)
      .maybeSingle(),
    supabase
      .from('trip_files')
      .select('*')
      .eq('trip_id', values.trip_id)
      .maybeSingle(),
  ]);

  if (tripResult.error) throw tripResult.error;
  if (customerFilesResult.error) throw customerFilesResult.error;
  if (tripFilesResult.error) throw tripFilesResult.error;
  if (!tripResult.data || tripResult.data.employee_id !== user.id) {
    throw new Error('لا تملك صلاحية تعديل هذه الرحلة');
  }

  const uploadedPaths: Record<FileField, string | null> = {
    flight_path: tripFilesResult.data?.flight_path ?? null,
    voucher_path: tripFilesResult.data?.voucher_path ?? null,
    car_path: tripFilesResult.data?.car_path ?? null,
    package_path: tripFilesResult.data?.package_path ?? null,
    inside_flight_path: tripFilesResult.data?.inside_flight_path ?? null,
    supplier_info_path: tripFilesResult.data?.supplier_info_path ?? null,
    customer_transfers_path: tripFilesResult.data?.customer_transfers_path ?? null,
    passport_path: customerFilesResult.data?.passport_path ?? null,
  };
  const newlyUploadedPaths: string[] = [];
  const oldPathsToRemove: string[] = [];

  try {
    for (const field of fileFields) {
      const file = values[field];
      if (!file) continue;

      const validationError = validatePdfFile(file);
      if (validationError) throw new Error(validationError);

      const parentPath =
        field === 'passport_path'
          ? `customers/${values.customer_id}`
          : `trips/${values.trip_id}`;
      const filePath = `${user.id}/${parentPath}/${field}-${crypto.randomUUID()}-${getSafeFileName(file.name)}`;
      const { error: uploadError } = await storage.upload(filePath, file, {
        cacheControl: '3600',
        contentType: 'application/pdf',
      });
      if (uploadError) throw uploadError;

      newlyUploadedPaths.push(filePath);
      const oldPath = uploadedPaths[field];
      if (oldPath) oldPathsToRemove.push(oldPath);
      uploadedPaths[field] = filePath;
    }

    const { error: saveError } = await supabase.rpc('save_trip_files', {
      p_customer_id: values.customer_id,
      p_trip_id: values.trip_id,
      p_passport_path: uploadedPaths.passport_path,
      p_flight_path: uploadedPaths.flight_path,
      p_inside_flight_path: uploadedPaths.inside_flight_path,
      p_voucher_path: uploadedPaths.voucher_path,
      p_car_path: uploadedPaths.car_path,
      p_package_path: uploadedPaths.package_path,
      p_supplier_info_path: uploadedPaths.supplier_info_path,
      p_customer_transfers_path: uploadedPaths.customer_transfers_path,
      p_notes: values.notes,
    });

    if (saveError) throw saveError;
  } catch (error) {
    if (newlyUploadedPaths.length > 0) await storage.remove(newlyUploadedPaths);
    throw error;
  }

  if (oldPathsToRemove.length > 0) {
    const { error: removeError } = await storage.remove([...new Set(oldPathsToRemove)]);
    if (removeError) {
      throw new Error('تم حفظ الملفات الجديدة، لكن تعذر حذف بعض الملفات القديمة من التخزين.');
    }
  }

  return uploadedPaths;
};
