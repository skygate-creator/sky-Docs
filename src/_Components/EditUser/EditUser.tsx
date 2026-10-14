'use client';

import { Check, Save, UserRoundPen } from 'lucide-react';
import { useFormik } from 'formik';
import { RecentClient } from '@/interface';
import useEditClient from '@/Hooks/useEditClients';
import { clientValidationSchema } from '../../validation/validation';

const fieldClassName =
  'h-12 w-full rounded-xl border border-[#c8d4e2] bg-white px-4 text-14 text-secondary-950 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100';

const currencies = [
  { value: 'SAR', label: 'ريال سعودي — SAR' },
  { value: 'EGP', label: 'جنيه مصري — EGP' },
  { value: 'AED', label: 'درهم إماراتي — AED' },
  { value: 'USD', label: 'دولار أمريكي — USD' },
];

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
        onSuccess: () => resetForm({ values }),
      });
    },
    enableReinitialize: true,
    validationSchema: clientValidationSchema,
  });

  const fields = [
    {
      label: 'اسم العميل',
      name: 'customer_name',
      type: 'text',
      placeholder: 'الاسم الكامل',
    },
    {
      label: 'رقم الهاتف',
      name: 'phone',
      type: 'tel',
      placeholder: 'مثال: 050 123 4567',
    },
    {
      label: 'إجمالي سعر الرحلة',
      name: 'trip_price',
      type: 'number',
      placeholder: '0.00',
    },
  ] as const;

  return (
    <section className="overflow-hidden rounded-[18px] border border-[#d4dfeb] bg-[#e8eef5] shadow-[0_10px_30px_rgba(54,74,104,0.04)]">
      <div className="flex items-center justify-between gap-4 border-b border-[#d4dfeb] px-5 py-4 md:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-500 text-12 font-bold text-white">
              1
            </span>
            <h2 className="text-17 font-bold text-secondary-950">
              البيانات الأساسية
            </h2>
          </div>
          <p className="mr-9 mt-1 text-11 text-secondary-400">
            بيانات التواصل والتكلفة الأساسية للرحلة.
          </p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-primary-500">
          <UserRoundPen className="h-5 w-5" />
        </span>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-5 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const error = formik.touched[field.name] && formik.errors[field.name];

            return (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-13 font-semibold text-secondary-700"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={field.placeholder}
                  className={`${fieldClassName} ${
                    error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''
                  }`}
                />
                {error && (
                  <p className="mt-1.5 text-12 text-red-500">
                    {String(formik.errors[field.name])}
                  </p>
                )}
              </div>
            );
          })}

          <div>
            <label
              htmlFor="currency"
              className="mb-2 block text-13 font-semibold text-secondary-700"
            >
              العملة
            </label>
            <select
              id="currency"
              name="currency"
              value={formik.values.currency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${fieldClassName} ${
                formik.touched.currency && formik.errors.currency ?
                  'border-red-300 focus:border-red-400 focus:ring-red-100'
                : ''
              }`}
            >
              <option value="">اختر العملة</option>
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
            {formik.touched.currency && formik.errors.currency && (
              <p className="mt-1.5 text-12 text-red-500">
                {String(formik.errors.currency)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#d4dfeb] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-11 text-secondary-400">
            <Check className="h-4 w-4 text-primary-500" />
            سيتم حفظ هذا القسم بشكل مستقل عن المستندات.
          </p>
          <button
            type="submit"
            disabled={isPending || !formik.dirty}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 text-13 font-bold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? <span className="loader" /> : <Save className="h-4 w-4" />}
            {isPending ? 'جاري الحفظ...' : 'حفظ البيانات الأساسية'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditUser;
