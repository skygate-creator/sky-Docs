'use client';

import { useFormik } from 'formik';
import { useUploadClientDocs } from '../../Hooks/UseUploadClientDocs';
import FileUploadCard from '../FileUploadCard/FileUploadCard';
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
import { ClientDocsFormValues } from '@/interface';

const ClientDocs = ({
  clientId,
  employeeId,
}: {
  clientId: string;
  employeeId: string;
}) => {
  const { mutate: uploadClientDocs, isPending } = useUploadClientDocs();

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
      notes: '',
    },
    onSubmit: async (values) => {
      uploadClientDocs({ values, employeeId });
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
          <FileUploadCard
            icon={Plane}
            name="تذكرة الطيران الدولي"
            onFileSelect={(file) => formik.setFieldValue('flight_path', file)}
          />

          <FileUploadCard
            icon={PlaneTakeoff}
            name="تذكرة الطيران الداخلي"
            onFileSelect={(file) =>
              formik.setFieldValue('inside_flight_path', file)
            }
          />

          <FileUploadCard
            icon={Hotel}
            name="قسيمة الفندق"
            onFileSelect={(file) => formik.setFieldValue('voucher_path', file)}
          />

          <FileUploadCard
            icon={Car}
            name="حجز السيارة"
            onFileSelect={(file) => formik.setFieldValue('car_path', file)}
          />

          <FileUploadCard
            icon={BriefcaseBusiness}
            name="الباقة السياحية"
            onFileSelect={(file) => formik.setFieldValue('package_path', file)}
          />

          <FileUploadCard
            icon={BadgeCheck}
            name="جواز السفر"
            onFileSelect={(file) => formik.setFieldValue('passport_path', file)}
          />

          <FileUploadCard
            icon={Building2}
            name="بيانات المورد"
            onFileSelect={(file) =>
              formik.setFieldValue('supplier_info_path', file)
            }
          />

          <FileUploadCard
            icon={Bus}
            name="تحويلات العملاء"
            onFileSelect={(file) =>
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
            placeholder="أدخل ملاحظاتك حول تفضيلات العميل أو تفاصيل الرحلة هنا..."
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
          : 'حفظ المستندات'}
        </button>
      </form>
    </div>
  );
};

export default ClientDocs;
