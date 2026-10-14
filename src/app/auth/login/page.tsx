'use client';

import { useLogin } from '@/Hooks/useLogIn';
import { useFormik } from 'formik';
import { useState } from 'react';
import {
  CloudCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
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
    <section className="relative h-[100dvh] w-full overflow-x-hidden overflow-y-auto bg-[#eef3f8] p-3 sm:p-5 lg:p-7">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl" />
        <span className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-full w-full min-w-0 max-w-[1120px] items-center justify-center">
        <div className="grid w-full min-w-0 overflow-hidden rounded-[24px] border border-[#c7d3e1]/80 bg-white shadow-[0_24px_70px_rgba(41,63,94,0.13)] sm:rounded-[30px] lg:min-h-[594px] lg:grid-cols-[0.93fr_1.07fr] lg:[direction:ltr]">
          <aside
            dir="rtl"
            className="relative hidden min-h-[594px] overflow-hidden bg-gradient-to-br from-[#1d67d9] to-[#123f91] p-10 text-white lg:block"
          >
            <div className="pointer-events-none absolute -bottom-28 -left-36 h-[310px] w-[310px] rounded-full border border-white/15 shadow-[0_0_0_54px_rgba(255,255,255,0.035),0_0_0_108px_rgba(255,255,255,0.025)]" />
            <div className="pointer-events-none absolute -right-20 top-40 h-48 w-48 rounded-full border border-white/15 shadow-[0_0_0_38px_rgba(255,255,255,0.04)]" />
            <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex items-center gap-3 [direction:ltr]">
              <span className="grid h-11 w-11 place-items-center rounded-[13px] bg-white text-primary-600 shadow-[0_10px_25px_rgba(4,23,63,0.18)]">
                <CloudCheck size={23} strokeWidth={2.2} aria-hidden="true" />
              </span>
              <span className="text-20 font-bold tracking-tight">Sky Docs</span>
            </div>

            <div className="relative z-10 mt-14 max-w-[390px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-12 font-semibold backdrop-blur-sm">
                <ShieldCheck size={15} aria-hidden="true" />
                مساحة عمل آمنة
              </span>
              <h2 className="mt-5 text-[31px] font-bold leading-[1.5] tracking-[-0.6px] text-white">
                كل ملفات عملائك
                <br />
                في مكان واحد منظّم.
              </h2>
              <p className="mt-3 text-14 leading-8 text-white/75">
                وصول سريع للملفات، متابعة أوضح للعملاء، وتجربة عمل هادئة لكل فريقك.
              </p>
            </div>

            <div className="relative z-10 mx-auto mt-9 h-[180px] w-[360px] max-w-full" aria-hidden="true">
              <div className="absolute left-2 top-7 h-[126px] w-[235px] -rotate-[8deg] rounded-[19px] border border-white/30 bg-white/55 shadow-[0_22px_42px_rgba(4,23,63,0.22)]" />
              <div className="absolute right-3 top-0 h-[126px] w-[235px] rotate-[4deg] rounded-[19px] border border-white/30 bg-white/95 p-[18px] text-secondary-900 shadow-[0_22px_42px_rgba(4,23,63,0.22)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-[34px] w-[34px] place-items-center rounded-[11px] bg-primary-50 text-primary-600">
                    <UserRound size={17} />
                  </span>
                  <div>
                    <p className="text-12 font-bold">ملف عميل جديد</p>
                    <p className="mt-1 text-[10px] text-slate-500">تم حفظ البيانات بنجاح</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <span className="block h-1.5 w-full rounded-full bg-slate-200" />
                  <span className="block h-1.5 w-[72%] rounded-full bg-slate-200" />
                </div>
              </div>
            </div>
          </aside>

          <main
            dir="rtl"
            className="flex min-h-[calc(100dvh-1.5rem)] min-w-0 flex-col justify-center bg-white px-6 py-9 sm:min-h-[620px] sm:px-12 sm:py-12 lg:min-h-[594px] lg:px-[58px] lg:py-12"
          >
            <div className="mb-12 flex items-center gap-3 [direction:ltr] lg:hidden">
              <span className="grid h-11 w-11 place-items-center rounded-[13px] bg-primary-50 text-primary-600">
                <CloudCheck size={23} strokeWidth={2.2} aria-hidden="true" />
              </span>
              <span className="text-20 font-bold tracking-tight text-primary-900">Sky Docs</span>
            </div>

            <header>
              <h1 className="text-[28px] font-bold leading-[1.35] tracking-[-0.7px] text-[#17253d] sm:text-[32px]">
                أهلاً بعودتك
              </h1>
              <p className="mt-2.5 text-14 leading-7 text-slate-500">
                سجّل الدخول للوصول إلى مساحة العمل الخاصة بك.
              </p>
            </header>

            <form onSubmit={formik.handleSubmit} className="mt-8 min-w-0 space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="mb-2 block text-13 font-semibold text-slate-700">
                  البريد الإلكتروني
                </label>
                <div className="relative min-w-0">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isPending}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="name@company.com"
                    className="h-[50px] w-full min-w-0 rounded-[13px] border border-[#dce5ef] bg-[#f9fbfd] px-11 text-13 text-[#17253d] outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-13 font-semibold text-slate-700">
                  كلمة المرور
                </label>
                <div className="relative min-w-0">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    disabled={isPending}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل كلمة المرور"
                    className="h-[50px] w-full min-w-0 rounded-[13px] border border-[#dce5ef] bg-[#f9fbfd] px-11 text-13 text-[#17253d] outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((isVisible) => !isVisible)}
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    aria-pressed={showPassword}
                    className="absolute left-3.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-primary-50 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <button
                disabled={isPending}
                type="submit"
                className="flex h-[51px] w-full items-center justify-center rounded-[13px] bg-gradient-to-br from-[#1d67d9] to-[#123f91] text-14 font-bold text-white shadow-[0_13px_28px_rgba(29,103,217,0.23)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(29,103,217,0.28)] focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? <span className="loader" aria-label="جاري تسجيل الدخول" /> : 'تسجيل الدخول'}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-11 text-slate-500">
              <ShieldCheck size={14} className="text-emerald-600" aria-hidden="true" />
              اتصال آمن ومشفّر لحماية بياناتك
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
