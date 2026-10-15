'use client';

import { Save, PlaneTakeoff } from 'lucide-react';
import { useFormik } from 'formik';
import { Trip } from '@/interface';
import useEditTrip from '@/Hooks/useEditTrip';
import { tripValidationSchema } from '@/validation/validation';

const fieldClassName =
  'h-12 w-full rounded-xl border border-[#c8d4e2] bg-white px-4 text-14 text-secondary-950 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100';

const EditTrip = ({ trip }: { trip: Trip }) => {
  const { mutate, isPending } = useEditTrip();
  const formik = useFormik({
    initialValues: {
      id: trip.id,
      trip_price: Number(trip.trip_price),
      currency: trip.currency,
    },
    validationSchema: tripValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      mutate(values, { onSuccess: () => resetForm({ values }) });
    },
  });

  return (
    <section className="overflow-hidden rounded-[18px] border border-[#d4dfeb] bg-[#e8eef5]">
      <div className="flex items-center justify-between border-b border-[#d4dfeb] px-5 py-4 md:px-6">
        <div><h2 className="text-17 font-bold text-secondary-950">بيانات الرحلة المحددة</h2><p className="mt-1 text-11 text-secondary-400">السعر والعملة خاصان بهذه الرحلة فقط.</p></div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-primary-500"><PlaneTakeoff className="h-5 w-5" /></span>
      </div>
      <form onSubmit={formik.handleSubmit} className="grid gap-4 p-5 md:grid-cols-2 md:p-6">
        <div>
          <label htmlFor="trip_price" className="mb-2 block text-13 font-semibold text-secondary-700">سعر الرحلة</label>
          <input id="trip_price" name="trip_price" type="number" value={formik.values.trip_price} onChange={formik.handleChange} onBlur={formik.handleBlur} className={fieldClassName} />
          {formik.touched.trip_price && formik.errors.trip_price && <p className="mt-1 text-11 text-red-500">{formik.errors.trip_price}</p>}
        </div>
        <div>
          <label htmlFor="currency" className="mb-2 block text-13 font-semibold text-secondary-700">العملة</label>
          <select id="currency" name="currency" value={formik.values.currency} onChange={formik.handleChange} onBlur={formik.handleBlur} className={fieldClassName}>
            <option value="SAR">ريال سعودي — SAR</option><option value="EGP">جنيه مصري — EGP</option><option value="AED">درهم إماراتي — AED</option><option value="USD">دولار أمريكي — USD</option>
          </select>
        </div>
        <div className="md:col-span-2 flex justify-end border-t border-[#d4dfeb] pt-4">
          <button type="submit" disabled={isPending || !formik.dirty} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-7 text-13 font-bold text-white disabled:opacity-50">
            <Save className="h-4 w-4" /> {isPending ? 'جاري الحفظ...' : 'حفظ بيانات الرحلة'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditTrip;
