'use client';

import Input from '@/_Components/Input/Input';
import { useLogin } from '@/Hooks/useLogIn';
import { useFormik } from 'formik';
import Image from 'next/image';

const login = () => {
  const { mutate: login, isPending } = useLogin();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      login(values);
    },
  });

  return (
    <section className="w-screen h-screen flex items-center justify-center px-5">
      <div className="grid sm:grid-cols-2 gap-2 bg-white shadow-lg">
        <div className="text flex flex-col gap-3 p-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-40 font-bold text-secondary-950">
              تسجيل الدخول
            </h1>
            <p className="text-18 text-neutral-700">
              قم بتسجيل الدخول للوصول إلى لوحة التحكم.
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
            <Input
              label="البريد الالكتروني"
              type="email"
              name="email"
              formik={formik}
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <Input
              label="كلمة المرور"
              type="password"
              name="password"
              formik={formik}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <button
              disabled={isPending}
              type="submit"
              className="bg-primary text-white py-2 rounded-md"
            >
              {isPending ?
                <span className="loader"></span>
              : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
        <div className="relative hidden sm:block">
          <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-500 to-primary-900 opacity-50"></span>
          <Image
            src="/login_img.webp"
            alt="login"
            width={300}
            height={500}
            priority
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default login;
