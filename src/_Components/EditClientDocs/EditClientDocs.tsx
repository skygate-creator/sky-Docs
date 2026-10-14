'use client';

import { useFormik } from 'formik';
import {
  Plane,
  PlaneTakeoff,
  Hotel,
  Car,
  BriefcaseBusiness,
  BadgeCheck,
  Building2,
  Bus,
  Save,
} from 'lucide-react';

import EditFileCard from '../EditFileCard/EditFileCard';
import { ClientDocsFormValues } from '@/interface';
import { useUploadClientDocsAfterEditing } from '@/Hooks/useUploadClientDocsAfterEditing';

interface DocumentFiles {
  flight_path: string | null;
  voucher_path: string | null;
  car_path: string | null;
  package_path: string | null;
  passport_path: string | null;
  inside_flight_path: string | null;
  supplier_info_path: string | null;
  customer_transfers_path: string | null;
}

interface EditClientDocsProps {
  clientId: string;
  employeeId: string;
  documentsUrls: DocumentFiles;
  documentPaths: DocumentFiles | null;
  notes?: string;
}

const documentFileFields = [
  'flight_path',
  'voucher_path',
  'car_path',
  'package_path',
  'passport_path',
  'inside_flight_path',
  'supplier_info_path',
  'customer_transfers_path',
] as const;

const getStoredFileName = (path: string | null | undefined, fallback: string) => {
  const storedName = path?.split('/').pop();
  if (!storedName) return `${fallback}.pdf`;

  try {
    return decodeURIComponent(storedName).replace(
      /^[a-z_]+-(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-)?/i,
      '',
    );
  } catch {
    return storedName;
  }
};

const EditClientDocs = ({
  clientId,
  employeeId,
  documentsUrls,
  documentPaths,
  notes,
}: EditClientDocsProps) => {
  const { mutate: uploadClientDocs, isPending } =
    useUploadClientDocsAfterEditing();

  const formik = useFormik<ClientDocsFormValues>({
    initialValues: {
      client_id: clientId,
      flight_path: null,
      voucher_path: null,
      car_path: null,
      package_path: null,
      passport_path: null,
      inside_flight_path: null,
      supplier_info_path: null,
      customer_transfers_path: null,
      notes: notes ?? '',
    },

    onSubmit: async (values) => {
      uploadClientDocs({
        values,
        employeeId,
      });
    },
  });

  const attachedDocumentsCount = documentFileFields.filter(
    (field) => documentsUrls[field] || formik.values[field],
  ).length;

  return (
    <section className="overflow-hidden rounded-[18px] border border-[#d4dfeb] bg-[#e8eef5] shadow-[0_10px_30px_rgba(54,74,104,0.04)]">
      <div className="flex flex-col gap-3 border-b border-[#d4dfeb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-500 text-12 font-bold text-white">
              2
            </span>
            <h2 className="text-17 font-bold text-secondary-950">
              المستندات والملاحظات
            </h2>
          </div>
          <p className="mr-9 mt-1 text-11 text-secondary-400">
            راجع الملفات الحالية أو استبدلها بملفات PDF جديدة.
          </p>
        </div>

        <span className="w-fit rounded-full bg-white px-3 py-1.5 text-11 font-semibold text-secondary-500">
          {attachedDocumentsCount} من 8 مرفقة
        </span>
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6 p-5 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <EditFileCard
            icon={<Plane className="h-4 w-4" />}
            name="تذكرة الطيران الدولي"
            fileName={getStoredFileName(
              documentPaths?.flight_path,
              'تذكرة الطيران الدولي',
            )}
            fileUrl={documentsUrls.flight_path}
            onFileChange={(file) => formik.setFieldValue('flight_path', file)}
          />

          <EditFileCard
            icon={<PlaneTakeoff className="h-4 w-4" />}
            name="تذكرة الطيران الداخلي"
            fileName={getStoredFileName(
              documentPaths?.inside_flight_path,
              'تذكرة الطيران الداخلي',
            )}
            fileUrl={documentsUrls.inside_flight_path}
            onFileChange={(file) =>
              formik.setFieldValue('inside_flight_path', file)
            }
          />

          <EditFileCard
            icon={<Hotel className="h-4 w-4" />}
            name="قسيمة الفندق"
            fileName={getStoredFileName(
              documentPaths?.voucher_path,
              'قسيمة الفندق',
            )}
            fileUrl={documentsUrls.voucher_path}
            onFileChange={(file) => formik.setFieldValue('voucher_path', file)}
          />

          <EditFileCard
            icon={<Car className="h-4 w-4" />}
            name="حجز السيارة"
            fileName={getStoredFileName(
              documentPaths?.car_path,
              'حجز السيارة',
            )}
            fileUrl={documentsUrls.car_path}
            onFileChange={(file) => formik.setFieldValue('car_path', file)}
          />

          <EditFileCard
            icon={<BriefcaseBusiness className="h-4 w-4" />}
            name="الباقة السياحية"
            fileName={getStoredFileName(
              documentPaths?.package_path,
              'الباقة السياحية',
            )}
            fileUrl={documentsUrls.package_path}
            onFileChange={(file) => formik.setFieldValue('package_path', file)}
          />

          <EditFileCard
            icon={<BadgeCheck className="h-4 w-4" />}
            name="جواز السفر"
            fileName={getStoredFileName(
              documentPaths?.passport_path,
              'جواز السفر',
            )}
            fileUrl={documentsUrls.passport_path}
            onFileChange={(file) => formik.setFieldValue('passport_path', file)}
          />

          <EditFileCard
            icon={<Building2 className="h-4 w-4" />}
            name="بيانات المورد"
            fileName={getStoredFileName(
              documentPaths?.supplier_info_path,
              'بيانات المورد',
            )}
            fileUrl={documentsUrls.supplier_info_path}
            onFileChange={(file) =>
              formik.setFieldValue('supplier_info_path', file)
            }
          />

          <EditFileCard
            icon={<Bus className="h-4 w-4" />}
            name="نقل العميل"
            fileName={getStoredFileName(
              documentPaths?.customer_transfers_path,
              'نقل العميل',
            )}
            fileUrl={documentsUrls.customer_transfers_path}
            onFileChange={(file) =>
              formik.setFieldValue('customer_transfers_path', file)
            }
          />
        </div>

        <div className="border-t border-[#d4dfeb] pt-5">
          <label
            htmlFor="notes"
            className="mb-2 block text-13 font-semibold text-secondary-700"
          >
            ملاحظات العميل
          </label>
          <p className="mb-3 text-11 text-secondary-400">
            أضف تفضيلات العميل أو أي تفاصيل مهمة تخص الرحلة.
          </p>

          <textarea
            id="notes"
            name="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            placeholder="أدخل ملاحظاتك حول تفضيلات العميل أو تفاصيل الرحلة..."
            className="h-36 w-full resize-none rounded-xl border border-[#c8d4e2] bg-white p-4 text-14 text-secondary-950 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-[#d4dfeb] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-11 text-secondary-400">
            الملفات الجديدة لن تُرفع إلا بعد الضغط على حفظ.
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-7 text-13 font-bold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? <span className="loader" /> : <Save className="h-4 w-4" />}
            {isPending ? 'جاري الحفظ...' : 'حفظ المستندات والملاحظات'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditClientDocs;
