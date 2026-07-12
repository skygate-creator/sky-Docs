'use client';
import { UserRoundPlus, Save, UserRoundPen } from 'lucide-react';
import Input from '../Input/Input';
import { useFormik } from 'formik';
import { RecentClient } from '@/interface';
import useEditClient from '@/Hooks/useEditClients';
import { clientValidationSchema } from '../../validation/validation';

const EditUser = ({ customer }: { customer: RecentClient }) => {
  const { mutate, isPending } = useEditClient();
  const formik = useFormik<RecentClient>({
    initialValues: {
      id: customer.id || '',
      customer_name: customer.customer_name || '',
      phone: customer.phone || '',
      trip_price: customer.trip_price || 0,
      currency: customer.currency || '',
    },
    onSubmit: (values, { resetForm }) => {
      mutate(values, {
        onSuccess: () => {
          resetForm();
        },
      });
    },
    enableReinitialize: true,
    validationSchema: clientValidationSchema,
  });
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-2 items-center px-1">
        <h4 className="font-bold">تعديل عميل</h4>
        <UserRoundPen className="w-6 h-6 text-primary-400" />
      </div>
      <div className="p-5 bg-white border-2 border-secondary-200 rounded-lg">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="اسم العميل"
              name="customer_name"
              placeholder="اسم العميل"
              formik={formik}
            />
            <Input
              label="رقم الهاتف"
              name="phone"
              placeholder="رقم الهاتف"
              formik={formik}
            />
            <Input
              label="اجمالي السعر"
              name="trip_price"
              type="number"
              placeholder="اجمالي السعر"
              formik={formik}
            />
            <Input
              label="العملة"
              name="currency"
              placeholder="العملة"
              formik={formik}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full w-full bg-primary-500 py-3 text-14 font-bold text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {isPending ?
              <span className="loader"></span>
            : 'تعديل البيانات'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
