'use client';

import { RecentClient } from '@/interface';
import {
  ArrowUpLeft,
  CheckCircle2,
  FileCheck2,
  FolderOpen,
  Plus,
  Search,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { formatMoney } from '@/Utils/currency';
import { formatLongDate } from '@/Utils/date';
import { getInitials } from '@/Utils/names';
import useAddTrip from '@/Hooks/useAddTrip';
import { tripValidationSchema } from '@/validation/validation';

type SortOrder = 'newest' | 'oldest';

const getCreatedAt = (client: RecentClient) => {
  const value = client.latest_trip_at ?? client.created_at;
  if (!value) return 0;
  const createdAt = new Date(value).getTime();
  return Number.isNaN(createdAt) ? 0 : createdAt;
};

const AllClintes = ({ clients }: { clients: RecentClient[] }) => {
  const router = useRouter();
  const { mutate: addTrip, isPending } = useAddTrip();
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedId, setSelectedId] = useState<string | undefined>(clients[0]?.id);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);

  const filteredClients = useMemo(() => {
    const searchValue = search.trim().toLocaleLowerCase('ar');
    const matchingClients = clients.filter((client) => {
      if (!searchValue) return true;
      return (
        client.customer_name.toLocaleLowerCase('ar').includes(searchValue) ||
        client.phone.includes(searchValue) ||
        client.customer_code.toLocaleLowerCase('en').includes(searchValue)
      );
    });

    return matchingClients.sort((firstClient, secondClient) => {
      const difference = getCreatedAt(firstClient) - getCreatedAt(secondClient);
      return sortOrder === 'newest' ? -difference : difference;
    });
  }, [clients, search, sortOrder]);

  const selectedClient =
    filteredClients.find((client) => client.id === selectedId) ?? filteredClients[0];

  const tripFormik = useFormik({
    initialValues: { trip_price: 0, currency: '' },
    validationSchema: tripValidationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!selectedClient?.id) return;
      addTrip(
        {
          customerId: selectedClient.id,
          tripPrice: values.trip_price,
          currency: values.currency,
        },
        {
          onSuccess: (trip) => {
            resetForm();
            setIsTripModalOpen(false);
            router.push(`/employee/customer/${trip.id}`);
          },
        },
      );
    },
  });

  return (
    <section className="w-full pb-8">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <label className="relative block">
          <span className="sr-only">البحث بالاسم أو رقم الهاتف أو رقم العميل</span>
          <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75849a]" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث بالاسم أو رقم الهاتف أو رقم العميل"
            className="h-12 w-full rounded-xl border border-[#cbd7e4] bg-white py-2 pl-4 pr-11 text-14 text-secondary-950 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
          />
        </label>

        <div className="grid grid-cols-2 rounded-xl border border-[#cbd7e4] bg-[#e4ebf3] p-1" aria-label="ترتيب العملاء">
          {([['newest', 'الأحدث'], ['oldest', 'الأقدم']] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={sortOrder === value}
              onClick={() => setSortOrder(value)}
              className={`min-h-10 min-w-24 rounded-lg px-5 text-13 font-semibold transition-colors ${
                sortOrder === value
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-secondary-500 hover:text-secondary-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.3fr)]">
        <div className="overflow-hidden rounded-[18px] border border-[#d4dfeb] bg-[#e8eef5]">
          <div className="flex items-center justify-between border-b border-[#d4dfeb] px-5 py-4">
            <h2 className="text-16 font-bold text-secondary-950">العملاء</h2>
            <span className="rounded-full bg-white px-3 py-1 text-11 font-medium text-secondary-500">{filteredClients.length} عميل</span>
          </div>

          <div className="max-h-[620px] overflow-y-auto">
            {filteredClients.length === 0 ? (
              <p className="px-5 py-14 text-center text-13 text-secondary-400">لا يوجد عملاء مطابقون للبحث</p>
            ) : filteredClients.map((client) => {
              const isSelected = client.id === selectedClient?.id;
              return (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => setSelectedId(client.id)}
                  className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-[#d4dfeb] px-4 py-4 text-right transition-colors first:border-t-0 ${
                    isSelected ? 'bg-primary-500 shadow-sm' : 'hover:bg-white/60'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] text-12 font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-[#eef3fb] text-[#526b98]'}`}>
                      {getInitials(client.customer_name)}
                    </span>
                    <span className="min-w-0">
                      <strong className={`block truncate text-13 ${isSelected ? 'text-white' : 'text-secondary-950'}`}>{client.customer_name}</strong>
                      <span dir="ltr" className={`block text-right text-11 ${isSelected ? 'text-white/75' : 'text-secondary-400'}`}>{client.phone}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-left">
                    <strong className={`block text-12 ${isSelected ? 'text-white' : 'text-secondary-800'}`}>
                      {client.trips_count === 1 ? 'رحلة واحدة' : `${client.trips_count} رحلات`}
                    </strong>
                    <span className={`mt-1 block text-10 ${isSelected ? 'text-white/70' : 'text-secondary-400'}`}>
                      {client.latest_trip_at ? formatLongDate(client.latest_trip_at) : 'بدون رحلات'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-72 rounded-[18px] border border-[#d4dfeb] bg-[#e8eef5] p-5 md:p-6">
          {!selectedClient ? (
            <div className="flex min-h-60 items-center justify-center text-13 text-secondary-400">اختر عميلًا لعرض التفاصيل</div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-white text-14 font-bold text-[#526b98]">{getInitials(selectedClient.customer_name)}</span>
                  <div className="min-w-0">
                    <h2 className="truncate text-18 font-bold text-secondary-950">{selectedClient.customer_name}</h2>
                    <p dir="ltr" className="text-right text-12 text-secondary-400">{selectedClient.phone}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#e1f5ed] px-3 py-1.5 text-10 font-bold text-[#167459]">عميل نشط</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoCard label="رقم العميل الثابت" value={selectedClient.customer_code} />
                <InfoCard label="إجمالي الرحلات" value={`${selectedClient.trips_count} رحلات`} />
                <InfoCard label="تاريخ التسجيل" value={formatLongDate(selectedClient.created_at)} />
                <InfoCard label="رقم الهاتف" value={selectedClient.phone} ltr />
              </div>

              <div className={`mt-3 flex items-center gap-3 rounded-xl border p-3 ${
                selectedClient.customer_files?.passport_path
                  ? 'border-[#bfe3d5] bg-[#e4f6ef] text-[#167459]'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}>
                {selectedClient.customer_files?.passport_path ? <FileCheck2 className="h-5 w-5" /> : <FolderOpen className="h-5 w-5" />}
                <div className="min-w-0 flex-1">
                  <strong className="block text-12">{selectedClient.customer_files?.passport_path ? 'جواز السفر محفوظ' : 'لم يُرفع جواز السفر بعد'}</strong>
                  <span className="mt-0.5 block text-10 opacity-80">
                    {selectedClient.customer_files?.passport_path ? 'سيُستخدم تلقائيًا مع الرحلة الجديدة' : 'يمكن رفعه عند إضافة مستندات الرحلة'}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-[1.2fr_1fr]">
                <button type="button" onClick={() => setIsTripModalOpen(true)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-13 font-bold text-white transition-colors hover:bg-primary-600">
                  <Plus className="h-4 w-4" /> رحلة جديدة لنفس العميل
                </button>
                <Link href={`/employee/customerInfo/${selectedClient.id}`} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#cbd7e4] bg-white px-5 text-13 font-semibold text-secondary-700 transition-colors hover:border-primary-300 hover:text-primary-600">
                  فتح الملف الكامل <ArrowUpLeft className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 border-t border-[#d1dce8] pt-4">
                <div className="mb-3 flex items-center justify-between gap-3"><h3 className="text-14 font-bold text-secondary-950">آخر الرحلات</h3><span className="text-10 text-secondary-400">الأحدث أولًا</span></div>
                <div className="space-y-2">
                  {selectedClient.trips.slice(0, 3).map((trip) => (
                    <Link key={trip.id} href={`/employee/customerInfo/${selectedClient.id}?trip=${trip.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-[#d4dfeb] bg-white px-4 py-3 transition hover:border-primary-200">
                      <span><strong className="block text-12 text-secondary-900">رحلة {formatLongDate(trip.created_at)}</strong><span className="mt-1 block text-10 text-secondary-400">فتح المستندات والملاحظات</span></span>
                      <strong className="text-12 text-primary-600">{formatMoney(trip.trip_price, trip.currency)}</strong>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isTripModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-secondary-950/35 p-3" role="dialog" aria-modal="true" aria-labelledby="new-trip-title" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setIsTripModalOpen(false);
        }}>
          <div className="w-full max-w-lg rounded-[18px] border border-[#d4dfeb] bg-white p-5 shadow-2xl md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div><h2 id="new-trip-title" className="text-18 font-bold text-secondary-950">رحلة جديدة لـ {selectedClient.customer_name}</h2><p className="mt-1 text-11 text-secondary-400">أدخل بيانات الرحلة فقط؛ بيانات العميل والجواز محفوظة.</p></div>
              <button type="button" onClick={() => setIsTripModalOpen(false)} aria-label="إغلاق" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary-50 text-secondary-600"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={tripFormik.handleSubmit} className="mt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="new-trip-price" className="mb-2 block text-13 font-semibold text-secondary-700">سعر الرحلة</label>
                  <input id="new-trip-price" name="trip_price" type="number" value={tripFormik.values.trip_price} onChange={tripFormik.handleChange} onBlur={tripFormik.handleBlur} className="h-12 w-full rounded-xl border border-[#c8d4e2] bg-white px-4 text-14 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100" />
                  {tripFormik.touched.trip_price && tripFormik.errors.trip_price && <p className="mt-1 text-11 text-red-500">{tripFormik.errors.trip_price}</p>}
                </div>
                <div>
                  <label htmlFor="new-trip-currency" className="mb-2 block text-13 font-semibold text-secondary-700">العملة</label>
                  <select id="new-trip-currency" name="currency" value={tripFormik.values.currency} onChange={tripFormik.handleChange} onBlur={tripFormik.handleBlur} className="h-12 w-full rounded-xl border border-[#c8d4e2] bg-white px-4 text-14 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100">
                    <option value="">اختر العملة</option><option value="SAR">ريال سعودي — SAR</option><option value="EGP">جنيه مصري — EGP</option><option value="AED">درهم إماراتي — AED</option><option value="USD">دولار أمريكي — USD</option>
                  </select>
                  {tripFormik.touched.currency && tripFormik.errors.currency && <p className="mt-1 text-11 text-red-500">{tripFormik.errors.currency}</p>}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary-50 p-3 text-11 text-primary-700"><CheckCircle2 className="h-4 w-4 shrink-0" />لن يتم إنشاء عميل جديد أو طلب رفع جواز السفر مرة أخرى.</div>
              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row">
                <button type="button" onClick={() => setIsTripModalOpen(false)} className="min-h-11 rounded-xl border border-[#cbd7e4] px-6 text-13 font-semibold text-secondary-700">إلغاء</button>
                <button type="submit" disabled={isPending} className="min-h-11 flex-1 rounded-xl bg-primary-500 px-6 text-13 font-bold text-white disabled:opacity-60">{isPending ? 'جاري إنشاء الرحلة...' : 'إنشاء الرحلة وإضافة مستنداتها'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

const InfoCard = ({ label, value, ltr = false }: { label: string; value: string; ltr?: boolean }) => (
  <div className="rounded-xl bg-[#dce5ef] p-4">
    <span className="block text-11 text-secondary-400">{label}</span>
    <strong dir={ltr ? 'ltr' : undefined} className={`mt-1 block text-13 text-secondary-950 ${ltr ? 'text-right' : ''}`}>{value}</strong>
  </div>
);

export default AllClintes;
