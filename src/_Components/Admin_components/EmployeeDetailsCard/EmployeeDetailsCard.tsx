'use client';

import { Profile } from '@/interface';
import {
  Activity,
  ArrowRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Inbox,
  Mail,
  Power,
  PowerOff,
  ShieldOff,
  UsersRound,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { createClient } from '../../../../lib/supabase/client';
import { formatDate, formatMonthYear } from '../../../Utils/date';
import { formatCurrencyTotals } from '../../../Utils/currency';
import StatCard from '@/_Components/StatCard/StatCard';
import AccountStatusBadge from '@/_Components/AccountStatusBadge/AccountStatusBadge';
import UserAvatar from '@/_Components/UserAvatar/UserAvatar';

interface EmployeeDetailsCardProps {
  user: Profile;
  clientsCount: number;
  monthlyRequests: number;
  totalRequests: number;
  totalsByCurrency: Record<string, number>;
  latestActivityAt?: string;
}

const EmployeeDetailsCard = ({
  user,
  clientsCount,
  monthlyRequests,
  totalRequests,
  totalsByCurrency,
  latestActivityAt,
}: EmployeeDetailsCardProps) => {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isActive, setIsActive] = useState(user.is_active);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async () => {
    const nextStatus = !isActive;
    setIsUpdating(true);

    try {
      const { data, error } = await supabase.rpc('admin_set_employee_active', {
        target_employee_id: user.id,
        new_active_state: nextStatus,
      });

      if (error) throw error;
      if (!data) throw new Error('لم يتم العثور على حساب الموظف');

      setIsActive(nextStatus);
      setIsConfirmOpen(false);
      toast.success(nextStatus ? 'تم تفعيل حساب الموظف' : 'تم إيقاف حساب الموظف', {
        position: 'top-center',
      });
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'تعذر تحديث حالة الحساب';
      toast.error(message, { position: 'top-center' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 px-1 text-12 text-secondary-400">
        <Link href="/admin/employee" className="transition hover:text-primary-600">
          الموظفين
        </Link>
        <span>‹</span>
        <strong className="font-semibold text-secondary-700">ملف {user.name}</strong>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-primary-100 bg-gradient-to-l from-primary-50 to-white p-5 shadow-sm">
        <span className="pointer-events-none absolute -left-16 -top-28 h-56 w-56 rounded-full bg-primary-100/50" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4 sm:items-center">
            <UserAvatar
              name={user.name}
              src={user.avatar_url}
              size="lg"
              shape="large"
              className="border-4 border-white shadow-md"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-24 font-bold text-secondary-950">{user.name}</h1>
                <AccountStatusBadge
                  isActive={isActive}
                  activeLabel="حساب نشط"
                  inactiveLabel="حساب موقوف"
                />
              </div>
              <p className="mt-1 text-14 font-semibold text-secondary-600">
                {user.job_title || 'موظف'}
              </p>
              <div className="mt-3 flex flex-col gap-2 text-12 text-secondary-400 sm:flex-row sm:flex-wrap sm:gap-x-5">
                <span className="flex items-center gap-1.5" dir="ltr">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  انضم {formatMonthYear(user.created_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  آخر دخول {user.last_login ? formatDate(user.last_login) : 'غير مسجل'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/admin/employee"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-13 font-semibold text-secondary-700 transition hover:bg-secondary-50"
            >
              <ArrowRight className="h-4 w-4" />
              رجوع للموظفين
            </Link>
            <button
              type="button"
              onClick={() => setIsConfirmOpen(true)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-13 font-semibold transition ${
                isActive ?
                  'border-red-100 text-red-600 hover:bg-red-50'
                : 'border-green-100 text-green-700 hover:bg-green-50'
              }`}
            >
              {isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              {isActive ? 'إيقاف الحساب' : 'تفعيل الحساب'}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="إجمالي العملاء"
          value={clientsCount.toLocaleString('en-US')}
          note="عميل مرتبط بالموظف"
          icon={UsersRound}
          color="blue"
          density="compact"
        />
        <StatCard
          label="ريكويستات هذا الشهر"
          value={monthlyRequests.toLocaleString('en-US')}
          note={`من أصل ${totalRequests.toLocaleString('en-US')} ريكويست`}
          icon={Inbox}
          color="orange"
          density="compact"
        />
        <StatCard
          label="قيمة الرحلات"
          value={formatCurrencyTotals(totalsByCurrency)}
          note="إجمالي العملاء المسجلين"
          icon={Banknote}
          color="purple"
          compactValue
          density="compact"
        />
        <StatCard
          label="آخر نشاط"
          value={latestActivityAt ? formatDate(latestActivityAt) : 'لا يوجد'}
          note="آخر عميل أو ريكويست"
          icon={Activity}
          color="green"
          compactValue
          density="compact"
        />
      </section>

      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-secondary-950/45 p-4"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target && !isUpdating) {
              setIsConfirmOpen(false);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="employee-status-title"
            className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isUpdating}
              aria-label="إغلاق"
              className="absolute right-4 top-4 rounded-lg p-2 text-secondary-400 transition hover:bg-secondary-100"
            >
              <X className="h-5 w-5" />
            </button>
            <span
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                isActive ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
              }`}
            >
              {isActive ? <ShieldOff className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
            </span>
            <h2 id="employee-status-title" className="mt-4 text-20 font-bold text-secondary-950">
              {isActive ? 'إيقاف حساب الموظف؟' : 'تفعيل حساب الموظف؟'}
            </h2>
            <p className="mt-2 text-14 leading-7 text-secondary-500">
              {isActive ?
                <>لن يتمكن <strong className="text-secondary-800">{user.name}</strong> من الدخول حتى تعيد تفعيل الحساب.</>
              : <>سيتمكن <strong className="text-secondary-800">{user.name}</strong> من الدخول واستخدام النظام مرة أخرى.</>
              }
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isUpdating}
                className="rounded-xl border border-secondary-200 px-4 py-2.5 text-14 font-semibold text-secondary-700 transition hover:bg-secondary-50 disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={updateStatus}
                disabled={isUpdating}
                className={`rounded-xl px-4 py-2.5 text-14 font-semibold text-white transition disabled:opacity-60 ${
                  isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isUpdating ? 'جاري الحفظ...' : isActive ? 'إيقاف الحساب' : 'تفعيل الحساب'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeDetailsCard;
