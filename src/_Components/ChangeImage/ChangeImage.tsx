import React from 'react';
import FileInput from '../FileInput/FileInput';
import { useFormik } from 'formik';
import useUploadAvatar from '@/Hooks/useUploadAvatar';

const ChangeImage = ({
  setIsOpen,
  id,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}) => {
  const { mutate: uploadAvatar } = useUploadAvatar();
  const formik = useFormik({
    initialValues: {
      avatar_url: null,
    },
    onSubmit: (values) => {
      uploadAvatar(
        {
          file: values.avatar_url!,
          userId: id,
        },
        { onSuccess: () => setIsOpen(false) },
      );
    },
  });
  return (
    <div className="w-screen h-screen fixed top-0 right-0 bg-black/50 backdrop-blur-sm drop-shadow-sm flex items-center justify-center z-[60]">
      <form className="bg-white p-5 rounded-2xl" onSubmit={formik.handleSubmit}>
        <FileInput
          setIsOpen={setIsOpen}
          formik={formik}
          name="avatar_url"
          label="الصورة الرئيسية"
        />
        <button
          className="bg-primary w-full text-white py-2 mt-4 rounded-md"
          type="submit"
        >
          تغيير
        </button>
      </form>
    </div>
  );
};

export default ChangeImage;
