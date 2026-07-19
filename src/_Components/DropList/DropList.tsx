'use client';
import { useState } from 'react';
import { FormikProps } from 'formik';

interface valuesProps {
  label: string;
  value: string;
}

interface DropListProps {
  data: valuesProps[];
  placeholder?: string;
  onSelect: (value: string) => void;
  name: string; // ✅ اسم الحقل في formik.values
  formik: FormikProps<any>; // ✅ نوع أدق من any
}

const DropList = ({
  data,
  placeholder,
  onSelect,
  name,
  formik,
}: DropListProps) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const item = data.find((i) => i.value === value);
    setSelectedValue(value);
    setSelectedLabel(item?.label || '');
    onSelect(value);
  };

  const errorMessage = formik.touched[name] && formik.errors[name];

  return (
    <div className="flex flex-col gap-1">
      <label className="text-14 text-primary">{placeholder}</label>
      <select
        value={selectedValue}
        onChange={handleChange}
        className={`border rounded-lg px-3 py-2 outline-none text-black w-full ${
          errorMessage ? '' : ''
        }`}
      >
        <option value="">{placeholder}</option>
        {data.map((item) => (
          <option className="text-14" key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {/* ERROR */}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage as string}</p>
      )}
    </div>
  );
};

export default DropList;
