'use client';
import { UserRoundPlus, Save } from 'lucide-react';
import Input from '../Input/Input';
import { useFormik } from 'formik';
import { AddClientForm } from '@/interface';
import useAddClient from '@/Hooks/useAddClient';
import { useRouter } from 'next/navigation';
import { clientValidationSchema } from '../../validation/validation';
const AddUserForm = () => {
  const router = useRouter();
  const { mutate } = useAddClient();
  const formik = useFormik<AddClientForm>({
    initialValues: {
      customer_name: '',
      phone: '',
      trip_price: 0,
      currency: '',
    },
    onSubmit: (values, { resetForm }) => {
      mutate(values, {
        onSuccess: (data) => {
          resetForm();
          router.replace(`/employee/customer/${data.id}`);
        },
      });
    },
    validationSchema: clientValidationSchema,
  });
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-2 items-center">
        <h4 className="font-bold">إضافة عميل جديد</h4>
        <UserRoundPlus className="w-6 h-6 text-primary-400" />
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
            className="btn bg-primary-500 text-white rounded-md w-full p-2 mt-3 flex justify-center items-center gap-2"
            type="submit"
          >
            حفظ <Save className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
