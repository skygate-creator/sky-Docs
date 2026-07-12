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
} from 'lucide-react';

import EditFileCard from '../EditFileCard/EditFileCard';
import { ClientDocsFormValues } from '@/interface';
import { useUploadClientDocsAfterEditing } from '@/Hooks/useUploadClientDocsAfterEditing';

interface DocumentSignedUrls {
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
  documentsUrls: DocumentSignedUrls;
  notes?: string;
}

const EditClientDocs = ({
  clientId,
  employeeId,
  documentsUrls,
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

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <h3 className="text-14 font-bold text-secondary-900">
          المستندات والوثائق
        </h3>

        <p className="text-14 text-secondary-400">8 مستندات مطلوبة</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <EditFileCard
            icon={<Plane className="h-4 w-4" />}
            name="تذكرة الطيران الدولي"
            fileName="تذكرة الطيران الدولي"
            fileUrl={documentsUrls.flight_path}
            onFileChange={(file) => formik.setFieldValue('flight_path', file)}
          />

          <EditFileCard
            icon={<PlaneTakeoff className="h-4 w-4" />}
            name="تذكرة الطيران الداخلي"
            fileName="تذكرة الطيران الداخلي"
            fileUrl={documentsUrls.inside_flight_path}
            onFileChange={(file) =>
              formik.setFieldValue('inside_flight_path', file)
            }
          />

          <EditFileCard
            icon={<Hotel className="h-4 w-4" />}
            name="قسيمة الفندق"
            fileName="قسيمة الفندق"
            fileUrl={documentsUrls.voucher_path}
            onFileChange={(file) => formik.setFieldValue('voucher_path', file)}
          />

          <EditFileCard
            icon={<Car className="h-4 w-4" />}
            name="حجز السيارة"
            fileName="حجز السيارة"
            fileUrl={documentsUrls.car_path}
            onFileChange={(file) => formik.setFieldValue('car_path', file)}
          />

          <EditFileCard
            icon={<BriefcaseBusiness className="h-4 w-4" />}
            name="الباقة السياحية"
            fileName="الباقة السياحية"
            fileUrl={documentsUrls.package_path}
            onFileChange={(file) => formik.setFieldValue('package_path', file)}
          />

          <EditFileCard
            icon={<BadgeCheck className="h-4 w-4" />}
            name="جواز السفر"
            fileName="جواز السفر"
            fileUrl={documentsUrls.passport_path}
            onFileChange={(file) => formik.setFieldValue('passport_path', file)}
          />

          <EditFileCard
            icon={<Building2 className="h-4 w-4" />}
            name="بيانات المورد"
            fileName="بيانات المورد"
            fileUrl={documentsUrls.supplier_info_path}
            onFileChange={(file) =>
              formik.setFieldValue('supplier_info_path', file)
            }
          />

          <EditFileCard
            icon={<Bus className="h-4 w-4" />}
            name="نقل العميل"
            fileName="نقل العميل"
            fileUrl={documentsUrls.customer_transfers_path}
            onFileChange={(file) =>
              formik.setFieldValue('customer_transfers_path', file)
            }
          />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-14 font-bold text-secondary-900">
            ملاحظات العميل
          </h3>

          <textarea
            name="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            placeholder="أدخل ملاحظاتك حول تفضيلات العميل أو تفاصيل الرحلة..."
            className="h-40 resize-none rounded-md border border-secondary-200 p-4 outline-none duration-200 focus:ring-1 focus:ring-primary-200"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-primary-500 py-3 text-14 font-bold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ?
            <span className="loader" />
          : 'حفظ التعديلات'}
        </button>
      </form>
    </div>
  );
};

export default EditClientDocs;
