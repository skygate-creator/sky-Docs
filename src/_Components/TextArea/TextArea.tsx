'use client';
export default function TextArea({
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
      <textarea
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        className="w-full border rounded-md p-2 outline-none focus:ring-1 h-[150px] resize-none focus:ring-primary/45 duration-200"
      />

      {/* ERROR */}
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-sm mt-1">{formik.errors[name]}</p>
      )}
    </div>
  );
}
