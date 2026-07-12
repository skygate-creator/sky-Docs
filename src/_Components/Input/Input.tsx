'use client';
// import { InputProps } from '../../interfaces/index';
export default function Input({
  label,
  name,
  type = 'text',
  placeholder,
  formik,
}: any) {
  return (
    <div className="mb-4">
      {/* LABEL */}
      <label className="block mb-1 text-14 font-medium text-primary">
        {label}
      </label>

      {/* INPUT */}
      <input
        dir="rtl"
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        type={type}
        placeholder={placeholder}
        className="w-full border rounded-md p-2 outline-none focus:ring-1 bg-neutral-100 focus:ring-primary-200 duration-200"
      />

      {/* ERROR */}
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-sm mt-1">{formik.errors[name]}</p>
      )}
    </div>
  );
}
