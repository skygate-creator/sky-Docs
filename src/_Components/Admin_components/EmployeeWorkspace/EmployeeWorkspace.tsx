'use client';

import { RecentClient, Request } from '@/interface';
import {
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Inbox,
  Search,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { formatDate } from '../../../Utils/date';
import { formatMoney } from '../../../Utils/currency';
import { getInitials } from '../../../Utils/names';
import EmployeeRequestCard from '../EmployeeRequestCard/EmployeeRequestCard';

type ActiveTab = 'clients' | 'requests';
type SortOrder = 'newest' | 'oldest';

const PAGE_SIZE = 10;

const EmployeeWorkspace = ({
  clients,
  requests,
}: {
  clients: RecentClient[];
  requests: Request[];
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('clients');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    setPage(1);
    setSearch('');
  }, [activeTab]);

  useEffect(() => {
    setPage(1);
  }, [search, sortOrder]);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return clients
      .filter(
        (client) =>
          !query ||
          client.customer_name.toLowerCase().includes(query) ||
          client.customer_code.toLowerCase().includes(query) ||
          client.phone.toLowerCase().includes(query),
      )
      .sort((first, second) => compareDates(first.created_at, second.created_at, sortOrder));
  }, [clients, search, sortOrder]);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests
      .filter(
        (request) =>
          !query ||
          request.phone.toLowerCase().includes(query) ||
          request.destination.toLowerCase().includes(query) ||
          request.trip_type.toLowerCase().includes(query),
      )
      .sort((first, second) => compareDates(first.created_at, second.created_at, sortOrder));
  }, [requests, search, sortOrder]);

  const activity = useMemo(
    () =>
      [
        ...clients.map((client) => ({
          id: `client-${client.id}`,
          type: 'client' as const,
          title: 'أضاف العميل',
          subject: client.customer_name,
          createdAt: client.created_at,
        })),
        ...requests.map((request) => ({
          id: `request-${request.id}`,
          type: 'request' as const,
          title: 'سجّل ريكويست إلى',
          subject: request.destination,
          createdAt: request.created_at,
        })),
      ]
        .filter((item): item is typeof item & { createdAt: string } => Boolean(item.createdAt))
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
        )
        .slice(0, 5),
    [clients, requests],
  );

  const currentItems = activeTab === 'clients' ? filteredClients : filteredRequests;
  const pagesCount = Math.max(1, Math.ceil(currentItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, pagesCount);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleClients = filteredClients.slice(startIndex, startIndex + PAGE_SIZE);
  const visibleRequests = filteredRequests.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <>
      <section className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm">
          <div className="flex border-b border-secondary-100 px-4">
            <TabButton
              active={activeTab === 'clients'}
              onClick={() => setActiveTab('clients')}
            >
              العملاء <span>{clients.length}</span>
            </TabButton>
            <TabButton
              active={activeTab === 'requests'}
              onClick={() => setActiveTab('requests')}
            >
              الريكويستات <span>{requests.length}</span>
            </TabButton>
          </div>

          <div className="flex flex-col gap-3 border-b border-secondary-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  activeTab === 'clients' ?
                    'ابحث باسم العميل أو الهاتف أو الكود...'
                  : 'ابحث بالوجهة أو الهاتف أو نوع الرحلة...'
                }
                className="w-full rounded-xl border border-secondary-200 bg-secondary-50 py-2.5 pl-4 pr-10 text-13 text-secondary-900 outline-none transition placeholder:text-secondary-300 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-50"
              />
            </div>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as SortOrder)}
              aria-label="ترتيب النتائج"
              className="rounded-xl border border-secondary-200 bg-white px-3 py-2.5 text-12 font-semibold text-secondary-700 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-50"
            >
              <option value="newest">الأحدث أولًا</option>
              <option value="oldest">الأقدم أولًا</option>
            </select>
          </div>

          {activeTab === 'clients' ?
            <ClientsList clients={visibleClients} />
          : <RequestsList
              requests={visibleRequests}
              onView={setSelectedRequest}
            />
          }

          {currentItems.length > PAGE_SIZE && (
            <div className="flex items-center justify-between border-t border-secondary-100 px-4 py-3">
              <p className="text-11 text-secondary-400">
                عرض {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, currentItems.length)} من{' '}
                {currentItems.length}
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
                <span className="min-w-16 text-center text-12 font-semibold text-secondary-700">
                  {currentPage} من {pagesCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(pagesCount, current + 1))}
                  disabled={currentPage === pagesCount}
                  aria-label="الصفحة التالية"
                  className="rounded-lg border border-secondary-200 p-2 text-secondary-600 transition hover:bg-secondary-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
          <h2 className="text-15 font-bold text-secondary-900">آخر نشاط</h2>
          <p className="mt-1 text-11 text-secondary-400">أحدث عمليات الموظف</p>

          {activity.length > 0 ?
            <div className="mt-3 divide-y divide-secondary-100">
              {activity.map((item) => {
                const isClient = item.type === 'client';
                return (
                  <div key={item.id} className="flex gap-3 py-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isClient ?
                          'bg-green-50 text-green-700'
                        : 'bg-primary-50 text-primary-600'
                      }`}
                    >
                      {isClient ?
                        <UserPlus className="h-4 w-4" />
                      : <FileCheck2 className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-12 leading-6 text-secondary-600">
                        {item.title}{' '}
                        <strong className="font-semibold text-secondary-900">
                          {item.subject}
                        </strong>
                      </p>
                      <span className="mt-0.5 block text-10 text-secondary-400">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          : <EmptyState
              icon={<Inbox />}
              title="لا يوجد نشاط حتى الآن"
              note="ستظهر عمليات الموظف هنا"
              compact
            />
          }
        </aside>
      </section>

      {selectedRequest && (
        <EmployeeRequestCard
          request={selectedRequest}
          setIsOpen={() => setSelectedRequest(null)}
        />
      )}
    </>
  );
};

const ClientsList = ({ clients }: { clients: RecentClient[] }) => {
  if (clients.length === 0) {
    return (
      <EmptyState
        icon={<UsersRound />}
        title="لا يوجد عملاء مطابقون"
        note="جرّب البحث بكلمة مختلفة"
      />
    );
  }

  return (
    <div className="px-4">
      <div className="hidden min-h-11 grid-cols-[minmax(220px,1.3fr)_minmax(120px,.7fr)_minmax(130px,.75fr)_100px] items-center gap-3 bg-secondary-50 px-3 text-10 font-semibold text-secondary-400 md:grid">
        <span>العميل</span>
        <span>آخر رحلة</span>
        <span>تاريخ الإضافة</span>
        <span className="text-center">الإجراء</span>
      </div>
      <div className="divide-y divide-secondary-100">
        {clients.map((client, index) => (
          <div
            key={client.id}
            className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-1 py-3 transition hover:bg-primary-50/30 md:grid-cols-[minmax(220px,1.3fr)_minmax(120px,.7fr)_minmax(130px,.75fr)_100px] md:px-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-11 font-bold ${avatarColors[index % avatarColors.length]}`}>
                {getInitials(client.customer_name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-13 font-bold text-secondary-900">
                  {client.customer_name}
                </p>
                <p className="mt-1 truncate text-11 text-secondary-400" dir="ltr">
                  {client.phone}
                </p>
                <p className="mt-1 text-10 font-semibold text-primary-500">
                  {client.trips_count === 1
                    ? 'رحلة واحدة'
                    : `${client.trips_count} رحلات`}
                </p>
              </div>
            </div>
            <p className="hidden text-12 font-semibold text-primary-600 md:block">
              {formatMoney(client.trip_price, client.currency)}
            </p>
            <p className="hidden text-11 text-secondary-500 md:block">
              {formatDate(client.created_at)}
            </p>
            <Link
              href={`/admin/employee/clientInfo/${client.id}`}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-secondary-200 px-3 py-2 text-11 font-semibold text-secondary-700 transition hover:bg-secondary-50"
            >
              عرض الملف
              <ChevronLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const RequestsList = ({
  requests,
  onView,
}: {
  requests: Request[];
  onView: (request: Request) => void;
}) => {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={<Inbox />}
        title="لا توجد ريكويستات مطابقة"
        note="جرّب البحث بكلمة مختلفة"
      />
    );
  }

  return (
    <div className="px-4">
      <div className="hidden min-h-11 grid-cols-[minmax(150px,1fr)_minmax(130px,.8fr)_minmax(125px,.75fr)_minmax(120px,.7fr)_95px] items-center gap-3 bg-secondary-50 px-3 text-10 font-semibold text-secondary-400 md:grid">
        <span>الوجهة</span>
        <span>نوع الرحلة</span>
        <span>رقم الهاتف</span>
        <span>التاريخ</span>
        <span className="text-center">الإجراء</span>
      </div>
      <div className="divide-y divide-secondary-100">
        {requests.map((request) => (
          <div
            key={request.id}
            className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-1 py-3 transition hover:bg-primary-50/30 md:grid-cols-[minmax(150px,1fr)_minmax(130px,.8fr)_minmax(125px,.75fr)_minmax(120px,.7fr)_95px] md:px-3"
          >
            <div className="min-w-0">
              <p className="truncate text-13 font-bold text-secondary-900">
                {request.destination}
              </p>
              <p className="mt-1 text-10 text-secondary-400 md:hidden">
                {request.trip_type} • {formatDate(request.created_at)}
              </p>
            </div>
            <span className="hidden w-fit rounded-full bg-primary-50 px-2.5 py-1 text-10 font-semibold text-primary-700 md:block">
              {request.trip_type}
            </span>
            <span className="hidden text-11 text-secondary-600 md:block" dir="ltr">
              {request.phone}
            </span>
            <span className="hidden text-11 text-secondary-500 md:block">
              {formatDate(request.created_at)}
            </span>
            <button
              type="button"
              onClick={() => onView(request)}
              className="rounded-lg border border-secondary-200 px-3 py-2 text-11 font-semibold text-secondary-700 transition hover:bg-secondary-50"
            >
              التفاصيل
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const TabButton = ({
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) => (
  <button
    type="button"
    className={`relative flex items-center gap-1.5 px-3 py-4 text-13 font-semibold transition after:absolute after:bottom-0 after:right-3 after:left-3 after:h-0.5 after:rounded-full ${
      active ?
        'text-primary-600 after:bg-primary-500'
      : 'text-secondary-400 after:bg-transparent hover:text-secondary-700'
    } [&>span]:rounded-lg [&>span]:bg-secondary-100 [&>span]:px-2 [&>span]:py-0.5 [&>span]:text-10 ${
      active ? '[&>span]:bg-primary-100 [&>span]:text-primary-700' : ''
    }`}
    {...props}
  >
    {children}
  </button>
);

const EmptyState = ({
  icon,
  title,
  note,
  compact = false,
}: {
  icon: React.ReactElement;
  title: string;
  note: string;
  compact?: boolean;
}) => (
  <div className={`flex flex-col items-center justify-center text-center ${compact ? 'min-h-48' : 'min-h-64'}`}>
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-400 [&>svg]:h-5 [&>svg]:w-5">
      {icon}
    </span>
    <p className="mt-3 text-13 font-semibold text-secondary-800">{title}</p>
    <p className="mt-1 text-11 text-secondary-400">{note}</p>
  </div>
);

const avatarColors = [
  'bg-primary-100 text-primary-700',
  'bg-tertiary-100 text-tertiary-600',
  'bg-purple-100 text-purple-700',
];

const compareDates = (
  first?: string,
  second?: string,
  order: SortOrder = 'newest',
) => {
  const firstDate = new Date(first ?? 0).getTime();
  const secondDate = new Date(second ?? 0).getTime();
  return order === 'newest' ? secondDate - firstDate : firstDate - secondDate;
};

export default EmployeeWorkspace;
