'use client';
import { ArrowLeft, UserRoundPlus } from 'lucide-react';
import Input from '../Input/Input';
import { useFormik } from 'formik';
import { AddClientForm } from '@/interface';
import useAddClient from '@/Hooks/useAddClient';
import { useRouter } from 'next/navigation';
import { clientValidationSchema } from '../../validation/validation';
const AddUserForm = () => {
  const router = useRouter();
  const { mutate, isPending } = useAddClient();
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
          router.replace(`/employee/customer/${data.trip_id}`);
        },
      });
    },
    validationSchema: clientValidationSchema,
  });
  return (
    <section className="rounded-[18px] border border-[#d4dfeb] bg-[#e8eef5] p-5 shadow-[0_10px_30px_rgba(54,74,104,0.04)] md:p-6 [&_input]:border-[#c8d4e2] [&_input]:bg-white">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-18 font-bold text-secondary-950">
            إضافة عميل ورحلته الأولى
          </h2>
          <p className="mt-1 text-12 text-secondary-400">
            العميل سيحصل على رقم ثابت، ويمكنك إضافة رحلات أخرى له لاحقًا.
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-500">
          <UserRoundPlus className="h-5 w-5" />
        </span>
      </div>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="اسم العميل"
              name="customer_name"
              placeholder="الاسم الكامل"
              formik={formik}
            />
            <Input
              label="رقم الهاتف"
              name="phone"
              placeholder="مثال: 050 123 4567"
              formik={formik}
            />
            <Input
              label="سعر الرحلة"
              name="trip_price"
              type="number"
              placeholder="0.00"
              formik={formik}
            />
            <div>
              <label className="mb-1 block text-14 font-medium text-primary">
                العملة
              </label>
              <select
                name="currency"
                value={formik.values.currency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-[42px] w-full rounded-md border border-[#c8d4e2] bg-white p-2 text-14 outline-none duration-200 focus:border-primary-300 focus:ring-1 focus:ring-primary-200"
              >
                <option value="">اختر العملة</option>
                <option value="SAR">ريال سعودي — SAR</option>
                <option value="EGP">جنيه مصري — EGP</option>
                <option value="AED">درهم إماراتي — AED</option>
                <option value="USD">دولار أمريكي — USD</option>
              </select>
              {formik.touched.currency && formik.errors.currency && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.currency}
                </p>
              )}
            </div>
          </div>
          <div className="mt-5 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-11 text-secondary-400">
              التالي: جواز العميل ومستندات الرحلة الأولى
            </p>
            <button
              className="flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-primary-500 px-6 text-13 font-bold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isPending}
            >
              {isPending ? <span className="loader" /> : 'حفظ ومتابعة'}
              {!isPending && <ArrowLeft className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddUserForm;
