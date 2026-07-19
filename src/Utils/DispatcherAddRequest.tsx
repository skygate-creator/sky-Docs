'use client';
import { SquarePlus } from 'lucide-react';
import { useFormik } from 'formik';
import { Request, UserDispatcher } from '@/interface';
import Input from '@/_Components/Input/Input';
import { useMemo } from 'react';
import DropList from '@/_Components/DropList/DropList';
import TextArea from '@/_Components/TextArea/TextArea';
import useAddRequest from '@/Hooks/useAddRequest';
import { dispatcherRequestSchema } from '@/validation/validation';

const DispatcherAddRequest = ({ users }: { users: any }) => {
  const { mutate: addRequest, isPending } = useAddRequest();
  const trip_Type = useMemo(
    () => [
      { value: 'برنامج', label: 'برنامج' },
      { value: 'طيران', label: 'طيران ' },
      { value: 'فنادق', label: 'فنادق' },
      { value: 'تأشيرات', label: 'تأشيرات' },
    ],
    [],
  );
  const lead_Source = useMemo(
    () => [
      { value: 'انستجرام', label: 'انستجرام' },
      { value: 'تيك توك', label: 'تيك توك' },
      { value: 'واتساب', label: 'واتساب' },
      { value: 'سناب شات', label: 'سناب شات' },
    ],
    [],
  );
  const formik = useFormik<Request>({
    initialValues: {
      employee_id: '',
      phone: '',
      destination: '',
      trip_type: '',
      passengers: '',
      departure_airport: '',
      arrival_airport: '',
      lead_source: '',
      customer_notes: '',
    },
    validationSchema: dispatcherRequestSchema,
    onSubmit: (values, { resetForm }) => {
      addRequest(values, { onSuccess: () => resetForm() });
    },
  });
  return (
    <div className="flex flex-col w-full">
      <div className="title flex gap-3 items-center bg-primary-200 p-4 rounded-t-lg">
        <SquarePlus className="w-5 h-5 text-primary-500" />
        <h3 className=" text-18 font-medium ">إضافة ريكويست جديد</h3>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="form bg-white p-5 border border-secondary-200 grid grid-cols-2  gap-5">
          <Input
            type="number"
            label="رقم هاتف العميل"
            name="phone"
            formik={formik}
            placeholder="رقم هاتف العميل"
          />{' '}
          <Input
            label="الوجهة"
            name="destination"
            formik={formik}
            placeholder="الوجهة"
          />
          <DropList
            data={trip_Type}
            formik={formik}
            name="trip_type"
            placeholder="أختر نوع الرحلة"
            onSelect={(e) => formik.setFieldValue('trip_type', e)}
          />
          <DropList
            data={lead_Source}
            formik={formik}
            name="lead_source"
            placeholder="أختر مصدر العميل"
            onSelect={(e) => formik.setFieldValue('lead_source', e)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="مطار المغادرة"
              name="departure_airport"
              formik={formik}
              placeholder="مطار المغادرة"
            />
            <Input
              label="مطار الوصول"
              name="arrival_airport"
              formik={formik}
              placeholder="مطار الوصول"
            />
          </div>
          <DropList
            data={users}
            name="employee_id"
            formik={formik}
            placeholder="اسم الموظف"
            onSelect={(e) => formik.setFieldValue('employee_id', e)}
          />
          <TextArea
            label="ملاحظات إضافية"
            name="customer_notes"
            formik={formik}
            placeholder="تفضيلات الفنادق, الميزانية المتوقعة ..."
          />
          <TextArea
            label="بيانات المسافرين"
            name="passengers"
            formik={formik}
            placeholder="2 كبار , 1طفل عمرة 5 سنوات"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary-500 p-4 rounded-lg col-span-2 hover:bg-primary-400 duration-200 text-white"
          >
            {isPending ?
              <span className="loader"></span>
            : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DispatcherAddRequest;
