'use client';

import { EmployeeDirectoryItem } from '@/interface';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldOff,
  UsersRound,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { createClient } from '../../../../lib/supabase/client';
import EmployeeCard from '../EmployeeCard/EmployeeCard';

type StatusFilter = 'all' | 'active' | 'inactive';
type SortOrder = 'newest' | 'oldest';

const PAGE_SIZE = 12;

const AllEmployee = ({ users }: { users: EmployeeDirectoryItem[] }) => {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState(users);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [page, setPage] = useState(1);
  const [pendingStatusChange, setPendingStatusChange] =
    useState<EmployeeDirectoryItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search, status, sortOrder]);

  const totals = useMemo(
    () => ({
      all: items.length,
      active: items.filter((user) => user.is_active).length,
      inactive: items.filter((user) => !user.is_active).length,
    }),
    [items],
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items
      .filter((user) => {
        const matchesSearch =
          !query ||
          user.name?.toLowerCase().includes(query) ||
          user.job_title?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query);
        const matchesStatus =
          status === 'all' ||
          (status === 'active' && user.is_active) ||
          (status === 'inactive' && !user.is_active);

        return matchesSearch && matchesStatus;
      })
      .sort((first, second) => {
        const firstDate = new Date(first.created_at).getTime();
        const secondDate = new Date(second.created_at).getTime();
        return sortOrder === 'newest' ? secondDate - firstDate : firstDate - secondDate;
      });
  }, [items, search, sortOrder, status]);

  const pagesCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, pagesCount);
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const updateEmployeeStatus = async () => {
    if (!pendingStatusChange) return;

    const nextStatus = !pendingStatusChange.is_active;
    setUpdatingId(pendingStatusChange.id);

    try {
      const { data, error } = await supabase.rpc('admin_set_employee_active', {
        target_employee_id: pendingStatusChange.id,
        new_active_state: nextStatus,
      });

      if (error) throw error;
      if (!data) throw new Error('لم يتم العثور على حساب الموظف');

      setItems((current) =>
        current.map((user) =>
          user.id === pendingStatusChange.id ?
            {
              ...user,
              is_active: nextStatus,
              updated_at: new Date().toISOString(),
            }
          : user,
        ),
      );
      setPendingStatusChange(null);
      toast.success(nextStatus ? 'تم تفعيل حساب الموظف' : 'تم إيقاف حساب الموظف', {
        position: 'top-center',
      });
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'تعذر تحديث حالة الحساب';
      toast.error(message, { position: 'top-center' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label="إجمالي الموظفين"
          value={totals.all}
          icon={<UsersRound className="h-5 w-5" />}
          color="primary"
        />
        <SummaryCard
          label="الحسابات النشطة"
          value={totals.active}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="green"
        />
        <SummaryCard
          label="الحسابات الموقوفة"
          value={totals.inactive}
          icon={<ShieldOff className="h-5 w-5" />}
          color="red"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-secondary-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث بالاسم أو المسمى الوظيفي أو البريد..."
              className="w-full rounded-xl border border-secondary-200 bg-secondary-50 py-2.5 pl-4 pr-10 text-14 text-secondary-900 outline-none transition placeholder:text-secondary-300 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-50"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex rounded-xl bg-secondary-50 p-1">
              <FilterButton
                active={status === 'all'}
                onClick={() => setStatus('all')}
              >
                الكل ({totals.all})
              </FilterButton>
              <FilterButton
                active={status === 'active'}
                onClick={() => setStatus('active')}
              >
                نشط ({totals.active})
              </FilterButton>
              <FilterButton
                active={status === 'inactive'}
                onClick={() => setStatus('inactive')}
              >
                موقوف ({totals.inactive})
              </FilterButton>
            </div>

            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as SortOrder)}
              aria-label="ترتيب الموظفين"
              className="rounded-xl border border-secondary-200 bg-white px-3 py-2.5 text-13 font-semibold text-secondary-700 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-50"
            >
              <option value="newest">الأحدث أولًا</option>
              <option value="oldest">الأقدم أولًا</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          {visibleUsers.length > 0 ?
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleUsers.map((user) => (
                <EmployeeCard
                  key={user.id}
                  user={user}
                  onStatusChange={() => setPendingStatusChange(user)}
                  isUpdating={updatingId === user.id}
                />
              ))}
            </div>
          : <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-400">
                <UsersRound className="h-6 w-6" />
              </span>
              <p className="mt-4 text-15 font-semibold text-secondary-800">
                لا يوجد موظفون مطابقون
              </p>
              <p className="mt-1 text-13 text-secondary-400">
                جرّب تغيير البحث أو حالة الحساب
              </p>
            </div>
          }
        </div>

        {filteredUsers.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-secondary-100 px-4 py-3">
            <p className="text-12 text-secondary-400">
              عرض {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} من{' '}
              {filteredUsers.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage === 1}
                aria-label="الصفحة السابقة"
                className="rounded-lg border border-secondary-200 p-2 text-secondary-600 transition hover:bg-secondary-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="min-w-20 text-center text-13 font-semibold text-secondary-700">
                {currentPage} من {pagesCount}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(pagesCount, current + 1))
                }
                disabled={currentPage === pagesCount}
                aria-label="الصفحة التالية"
                className="rounded-lg border border-secondary-200 p-2 text-secondary-600 transition hover:bg-secondary-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {pendingStatusChange && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/45 p-4"
          onMouseDown={(event) => {
            if (
              event.currentTarget === event.target &&
              updatingId !== pendingStatusChange.id
            ) {
              setPendingStatusChange(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="employee-status-title"
            className="relative w-full max-w-md rounded-2xl border border-secondary-100 bg-white p-6 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setPendingStatusChange(null)}
              disabled={updatingId === pendingStatusChange.id}
              aria-label="إغلاق"
              className="absolute right-4 top-4 rounded-lg p-2 text-secondary-400 transition hover:bg-secondary-100"
            >
              <X className="h-5 w-5" />
            </button>
            <span
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                pendingStatusChange.is_active ?
                  'bg-red-50 text-red-600'
                : 'bg-green-50 text-green-700'
              }`}
            >
              {pendingStatusChange.is_active ?
                <ShieldOff className="h-6 w-6" />
              : <CheckCircle2 className="h-6 w-6" />}
            </span>
            <h3
              id="employee-status-title"
              className="mt-4 text-20 font-bold text-secondary-950"
            >
              {pendingStatusChange.is_active ? 'إيقاف حساب الموظف؟' : 'تفعيل حساب الموظف؟'}
            </h3>
            <p className="mt-2 text-14 leading-7 text-secondary-500">
              {pendingStatusChange.is_active ?
                <>لن يتمكن <strong className="text-secondary-800">{pendingStatusChange.name}</strong> من الدخول للنظام حتى تعيد تفعيل الحساب.</>
              : <>سيتمكن <strong className="text-secondary-800">{pendingStatusChange.name}</strong> من الدخول واستخدام النظام مرة أخرى.</>
              }
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPendingStatusChange(null)}
                disabled={updatingId === pendingStatusChange.id}
                className="rounded-xl border border-secondary-200 px-4 py-2.5 text-14 font-semibold text-secondary-700 transition hover:bg-secondary-50 disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={updateEmployeeStatus}
                disabled={updatingId === pendingStatusChange.id}
                className={`rounded-xl px-4 py-2.5 text-14 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  pendingStatusChange.is_active ?
                    'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {updatingId === pendingStatusChange.id ?
                  'جاري الحفظ...'
                : pendingStatusChange.is_active ?
                  'إيقاف الحساب'
                : 'تفعيل الحساب'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const FilterButton = ({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) => (
  <button
    type="button"
    className={`whitespace-nowrap rounded-lg px-3 py-2 text-12 font-semibold transition ${
      active ?
        'bg-white text-primary-700 shadow-sm'
      : 'text-secondary-500 hover:text-secondary-800'
    } ${className ?? ''}`}
    {...props}
  />
);

const summaryColors = {
  primary: 'bg-primary-50 text-primary-600',
  green: 'bg-green-50 text-green-700',
  red: 'bg-red-50 text-red-600',
};

const SummaryCard = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: keyof typeof summaryColors;
}) => (
  <article className="flex items-center gap-4 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
    <span
      className={`flex h-11 w-11 items-center justify-center rounded-xl ${summaryColors[color]}`}
    >
      {icon}
    </span>
    <div>
      <p className="text-12 font-medium text-secondary-400">{label}</p>
      <strong className="mt-0.5 block text-24 font-bold text-secondary-950">
        {value.toLocaleString('en-US')}
      </strong>
    </div>
  </article>
);

export default AllEmployee;
