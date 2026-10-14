'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  CheckCheck,
  ChevronLeft,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Radio,
  Route,
  Search,
  Users,
  X,
} from 'lucide-react';
import { useRealtimeRequests } from '../../Hooks/useRealtimeRequest';
import { Request } from '@/interface';
import { formatDate } from '@/Utils/date';
import useUpdateRequest from '@/Hooks/useUpdateRequest';

type StatusFilter = 'all' | 'new' | 'received';
type SortOrder = 'newest' | 'oldest';

const RequestsList = ({ Requests }: { Requests: Request[] }) => {
  const requests = useRealtimeRequests(Requests);
  const { mutate: receiveRequest, isPending } = useUpdateRequest();
  const [selectedId, setSelectedId] = useState<string | null>(
    Requests[0]?.id ?? null,
  );
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const newCount = requests.filter((request) => !request.is_read).length;
  const receivedCount = requests.length - newCount;

  const visibleRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return requests
      .filter((request) => {
        const matchesStatus =
          status === 'all' ||
          (status === 'new' && !request.is_read) ||
          (status === 'received' && request.is_read);

        const matchesSearch =
          !normalizedSearch ||
          [request.phone, request.destination, request.trip_type].some(
            (value) => value?.toLowerCase().includes(normalizedSearch),
          );

        return matchesStatus && matchesSearch;
      })
      .sort((first, second) => {
        const firstDate = new Date(first.created_at ?? 0).getTime();
        const secondDate = new Date(second.created_at ?? 0).getTime();
        return sortOrder === 'newest' ? secondDate - firstDate : firstDate - secondDate;
      });
  }, [requests, search, sortOrder, status]);

  useEffect(() => {
    const selectedIsVisible = visibleRequests.some(
      (request) => request.id === selectedId,
    );

    if (!selectedIsVisible) {
      setSelectedId(visibleRequests[0]?.id ?? null);
    }
  }, [selectedId, visibleRequests]);

  const selectedRequest =
    visibleRequests.find((request) => request.id === selectedId) ?? null;

  const selectNextRequest = () => {
    if (!selectedRequest) return;
    const currentIndex = visibleRequests.findIndex(
      (request) => request.id === selectedRequest.id,
    );
    const nextRequest =
      visibleRequests[currentIndex + 1] ?? visibleRequests[currentIndex - 1];
    setSelectedId(nextRequest?.id ?? null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-gradient-to-l from-primary-50 to-white p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-13 font-semibold text-primary-600">إدارة الطلبات</p>
          <h1 className="mt-1 text-24 font-bold text-secondary-900">
            الريكويستات الجديدة
          </h1>
          <p className="mt-1 text-14 text-secondary-400">
            راجع طلبات العملاء واستلم المناسب منها
          </p>
        </div>

        <div className="flex gap-2">
          <StatBadge value={newCount} label="جديد" />
          <StatBadge value={receivedCount} label="تم استلامه" />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-secondary-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث برقم الهاتف أو الوجهة"
            className="w-full rounded-xl border border-secondary-200 bg-secondary-50 py-2.5 pl-4 pr-10 text-14 text-secondary-900 outline-none transition focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-50"
          />
        </label>

        <div className="flex gap-1 overflow-x-auto rounded-xl bg-secondary-50 p-1">
          <FilterButton
            active={status === 'all'}
            onClick={() => setStatus('all')}
          >
            الكل
          </FilterButton>
          <FilterButton
            active={status === 'new'}
            onClick={() => setStatus('new')}
          >
            جديد
          </FilterButton>
          <FilterButton
            active={status === 'received'}
            onClick={() => setStatus('received')}
          >
            تم الاستلام
          </FilterButton>
        </div>

        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          aria-label="ترتيب الريكويستات"
          className="rounded-xl border border-secondary-200 bg-white px-3 py-2.5 text-14 text-secondary-700 outline-none focus:border-primary-400"
        >
          <option value="newest">الأحدث أولاً</option>
          <option value="oldest">الأقدم أولاً</option>
        </select>
      </div>

      <div className="grid min-h-[500px] gap-4 lg:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="order-1 flex max-h-[620px] flex-col gap-2 overflow-y-auto rounded-2xl border border-secondary-200 bg-white p-2 shadow-sm lg:order-none">
          {visibleRequests.length > 0 ?
            visibleRequests.map((request) => (
              <RequestListItem
                key={request.id}
                request={request}
                active={request.id === selectedId}
                onClick={() => setSelectedId(request.id ?? null)}
              />
            ))
          : <div className="flex min-h-52 flex-col items-center justify-center px-5 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-50 text-secondary-400">
                <Search className="h-5 w-5" />
              </span>
              <p className="mt-3 text-14 font-semibold text-secondary-700">
                لا توجد ريكويستات مطابقة
              </p>
              <p className="mt-1 text-12 text-secondary-400">
                غيّر البحث أو حالة الريكويست
              </p>
            </div>
          }
        </aside>

        <div className="order-2 lg:order-none">
          {selectedRequest ?
            <RequestDetails
              request={selectedRequest}
              isPending={isPending}
              onReceive={() => receiveRequest(selectedRequest.id)}
              onSkip={selectNextRequest}
            />
          : <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-secondary-200 bg-white p-6 text-center shadow-sm">
              <div>
                <p className="text-16 font-semibold text-secondary-700">
                  اختر ريكويست لعرض تفاصيله
                </p>
                <p className="mt-1 text-13 text-secondary-400">
                  ستظهر بيانات العميل والرحلة هنا
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

const StatBadge = ({ value, label }: { value: number; label: string }) => (
  <div className="min-w-24 rounded-xl border border-secondary-200 bg-white px-3 py-2 shadow-sm">
    <strong className="text-20 text-secondary-900">{value}</strong>
    <span className="mr-1.5 text-12 text-secondary-400">{label}</span>
  </div>
);

const FilterButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`whitespace-nowrap rounded-lg px-4 py-2 text-13 font-semibold transition ${
      active ? 'bg-primary-500 text-white shadow-sm' : 'text-secondary-500 hover:bg-white'
    }`}
  >
    {children}
  </button>
);

const RequestListItem = ({
  request,
  active,
  onClick,
}: {
  request: Request;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full rounded-xl border p-4 text-right transition ${
      active ?
        'border-primary-200 bg-primary-50 shadow-[inset_-3px_0_0_#2563EB]'
      : 'border-transparent bg-white hover:bg-secondary-50'
    }`}
  >
    <span className="flex items-center justify-between gap-3">
      <strong className="text-14 text-secondary-900" dir="ltr">
        {request.phone}
      </strong>
      <StatusBadge received={Boolean(request.is_read)} />
    </span>
    <span className="mt-3 flex items-center justify-between gap-3 text-12 text-secondary-400">
      <span className="flex items-center gap-1">
        <MapPin className="h-3.5 w-3.5" />
        {request.destination || 'بدون وجهة'}
      </span>
      <span>{formatDate(request.created_at)}</span>
    </span>
    <span className="mt-3 flex items-center justify-between">
      <span className="rounded-md bg-secondary-50 px-2 py-1 text-11 font-medium text-secondary-600">
        {request.trip_type || 'غير محدد'}
      </span>
      <ChevronLeft className="h-4 w-4 text-secondary-400" />
    </span>
  </button>
);

const StatusBadge = ({ received }: { received: boolean }) => (
  <span
    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-11 font-semibold ${
      received ? 'bg-green-50 text-green-700' : 'bg-tertiary-50 text-tertiary-600'
    }`}
  >
    {received ? 'تم الاستلام' : 'جديد'}
  </span>
);

const RequestDetails = ({
  request,
  isPending,
  onReceive,
  onSkip,
}: {
  request: Request;
  isPending: boolean;
  onReceive: () => void;
  onSkip: () => void;
}) => {
  const whatsappPhone = request.phone.replace(/\D/g, '');
  const hasRoute = request.departure_airport || request.arrival_airport;

  return (
    <article className="flex min-h-[500px] flex-col rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 border-b border-secondary-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-12 font-medium text-secondary-400">
            تفاصيل الريكويست
          </span>
          <h2 className="mt-1 text-28 font-bold text-secondary-900">
            {request.destination || 'بدون وجهة'}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Phone className="h-4 w-4 text-primary-500" />
            <strong className="text-14 text-secondary-700" dir="ltr">
              {request.phone}
            </strong>
            <Link
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-12 font-semibold text-green-700 transition hover:bg-green-100"
            >
              <MessageCircle className="h-4 w-4" />
              واتساب
            </Link>
          </div>
        </div>
        <span className="self-start rounded-lg bg-primary-100 px-3 py-2 text-12 font-semibold text-primary-700">
          {request.trip_type || 'غير محدد'}
        </span>
      </div>

      <div className="my-5 grid gap-3 sm:grid-cols-2">
        <DetailCard
          icon={<Users />}
          label="المسافرون"
          value={request.passengers || 'لا توجد تفاصيل'}
        />
        <DetailCard
          icon={<Route />}
          label="خط الرحلة"
          value={
            hasRoute ?
              `${request.departure_airport || 'غير محدد'} ← ${request.arrival_airport || 'غير محدد'}`
            : 'لا توجد تفاصيل'
          }
        />
        <DetailCard
          icon={<Radio />}
          label="مصدر العميل"
          value={request.lead_source || 'غير محدد'}
        />
        <DetailCard
          icon={<Clock3 />}
          label="وقت الوصول"
          value={formatDate(request.created_at)}
        />
      </div>

      <div className="rounded-xl border border-tertiary-200 bg-tertiary-50 p-4">
        <span className="text-12 font-semibold text-tertiary-600">
          ملاحظات العميل
        </span>
        <p className="mt-2 text-14 leading-7 text-secondary-700">
          {request.customer_notes || 'لا توجد ملاحظات إضافية'}
        </p>
      </div>

      <div className="mt-auto flex flex-col-reverse gap-3 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary-50 px-5 py-3 text-14 font-semibold text-secondary-500 transition hover:bg-secondary-100"
        >
          <X className="h-4 w-4" />
          تخطي مؤقتًا
        </button>
        <button
          type="button"
          onClick={onReceive}
          disabled={request.is_read || isPending}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-14 font-semibold text-white transition disabled:cursor-not-allowed ${
            request.is_read ?
              'bg-green-600'
            : 'bg-primary-500 hover:bg-primary-600 disabled:opacity-60'
          }`}
        >
          {request.is_read ?
            <>
              <CheckCheck className="h-4 w-4" />
              تم الاستلام
            </>
          : isPending ?
            'جاري الاستلام...'
          : <>
              <Check className="h-4 w-4" />
              استلام الريكويست
            </>
          }
        </button>
      </div>
    </article>
  );
};

const DetailCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactElement;
  label: string;
  value: string;
}) => (
  <div className="rounded-xl bg-secondary-50 p-4">
    <span className="flex items-center gap-2 text-12 text-secondary-400">
      <span className="text-primary-500 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {label}
    </span>
    <strong className="mt-2 block text-14 text-secondary-800">{value}</strong>
  </div>
);

export default RequestsList;
