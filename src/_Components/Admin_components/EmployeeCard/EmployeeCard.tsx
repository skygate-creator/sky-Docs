import { EmployeeDirectoryItem } from '@/interface';
import {
  CalendarDays,
  Eye,
  Inbox,
  Power,
  PowerOff,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import AccountStatusBadge from '@/_Components/AccountStatusBadge/AccountStatusBadge';
import UserAvatar from '@/_Components/UserAvatar/UserAvatar';

interface EmployeeCardProps {
  user: EmployeeDirectoryItem;
  onStatusChange: () => void;
  isUpdating: boolean;
}

const EmployeeCard = ({
  user,
  onStatusChange,
  isUpdating,
}: EmployeeCardProps) => {
  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
        user.is_active ? 'border-secondary-200' : 'border-red-100 bg-red-50/20'
      }`}
    >
      <div className="flex items-start gap-3">
        <UserAvatar name={user.name} src={user.avatar_url} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-16 font-bold text-secondary-950">
                {user.name}
              </h2>
              <p className="mt-0.5 truncate text-12 text-secondary-400">
                {user.job_title || 'موظف'}
              </p>
            </div>
            <AccountStatusBadge isActive={user.is_active} />
          </div>
          <p className="mt-2 truncate text-11 text-secondary-400" dir="ltr">
            {user.email}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <StatItem
          icon={<UsersRound />}
          label="العملاء"
          value={user.clients_count}
        />
        <StatItem
          icon={<Inbox />}
          label="الريكويستات"
          value={user.requests_count}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 text-11 text-secondary-400">
        <CalendarDays className="h-3.5 w-3.5" />
        <span>انضم {formatJoinDate(user.created_at)}</span>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2 border-t border-secondary-100 pt-3">
        <Link
          href={`/admin/employee/${user.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-13 font-semibold text-white transition hover:bg-primary-600"
        >
          <Eye className="h-4 w-4" />
          عرض التفاصيل
        </Link>
        <button
          type="button"
          onClick={onStatusChange}
          disabled={isUpdating}
          title={user.is_active ? 'إيقاف الحساب' : 'تفعيل الحساب'}
          aria-label={user.is_active ? 'إيقاف الحساب' : 'تفعيل الحساب'}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${
            user.is_active ?
              'border-red-100 text-red-600 hover:bg-red-50'
            : 'border-green-100 text-green-700 hover:bg-green-50'
          }`}
        >
          {user.is_active ?
            <PowerOff className="h-4 w-4" />
          : <Power className="h-4 w-4" />}
        </button>
      </div>
    </article>
  );
};

const StatItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactElement;
  label: string;
  value: number;
}) => (
  <div className="rounded-xl bg-secondary-50 p-3">
    <div className="flex items-center gap-1.5 text-secondary-400">
      <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
      <span className="text-11">{label}</span>
    </div>
    <strong className="mt-1 block text-18 font-bold text-secondary-900">
      {value.toLocaleString('en-US')}
    </strong>
  </div>
);

const formatJoinDate = (value: string) =>
  new Intl.DateTimeFormat('ar-EG', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));

export default EmployeeCard;
