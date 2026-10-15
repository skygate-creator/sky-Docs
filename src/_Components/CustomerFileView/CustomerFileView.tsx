import { ClientDetails } from '@/interface';
import getClientDocs from '../../../lib/Helper/getClientDocs';
import getClientDocumentsSignedUrls from '../../../lib/Helper/getClientDocumentUrls';
import { formatMoney } from '@/Utils/currency';
import { formatLongDate } from '@/Utils/date';
import CustomerInfo from '../CustomerInfo/CustomerInfo';
import ReadFileCard from '../ReadFileCard/ReadFileCard';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Bus,
  Car,
  Hotel,
  MessageSquareText,
  Plane,
  PlaneTakeoff,
} from 'lucide-react';
import Link from 'next/link';

interface CustomerFileViewProps {
  customer: ClientDetails;
  requestedTripId?: string;
  tripBaseHref: string;
  backHref: string;
  backLabel: string;
  editBaseHref?: string;
}

const CustomerFileView = async ({
  customer,
  requestedTripId,
  tripBaseHref,
  backHref,
  backLabel,
  editBaseHref,
}: CustomerFileViewProps) => {
  const selectedTrip =
    customer.trips.find((trip) => trip.id === requestedTripId) ??
    customer.trips[0];
  const clientDocs = selectedTrip
    ? await getClientDocs(selectedTrip.id, customer.id)
    : [];
  const documentUrls = await getClientDocumentsSignedUrls(clientDocs[0]);
  const documentsCount = Object.values(documentUrls).filter(Boolean).length;
  const editHref =
    editBaseHref && selectedTrip
      ? `${editBaseHref}?trip=${selectedTrip.id}`
      : editBaseHref;

  const documents = [
    {
      name: 'تذكرة الطيران الدولي',
      fileName: 'تذكرة الطيران الدولي',
      fileUrl: documentUrls.flight_path,
      icon: <Plane className="h-5 w-5" />,
    },
    {
      name: 'تذكرة الطيران الداخلي',
      fileName: 'تذكرة الطيران الداخلي',
      fileUrl: documentUrls.inside_flight_path,
      icon: <PlaneTakeoff className="h-5 w-5" />,
    },
    {
      name: 'قسيمة الفندق',
      fileName: 'قسيمة الفندق',
      fileUrl: documentUrls.voucher_path,
      icon: <Hotel className="h-5 w-5" />,
    },
    {
      name: 'حجز السيارة',
      fileName: 'حجز السيارة',
      fileUrl: documentUrls.car_path,
      icon: <Car className="h-5 w-5" />,
    },
    {
      name: 'الباقة السياحية',
      fileName: 'الباقة السياحية',
      fileUrl: documentUrls.package_path,
      icon: <BriefcaseBusiness className="h-5 w-5" />,
    },
    {
      name: 'جواز السفر الثابت',
      fileName: 'جواز السفر',
      fileUrl: documentUrls.passport_path,
      icon: <BadgeCheck className="h-5 w-5" />,
    },
    {
      name: 'بيانات المورد',
      fileName: 'بيانات المورد',
      fileUrl: documentUrls.supplier_info_path,
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      name: 'تحويلات العملاء',
      fileName: 'تحويلات العملاء',
      fileUrl: documentUrls.customer_transfers_path,
      icon: <Bus className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 p-3">
      <header>
        <Link
          href={backHref}
          className="mb-2 inline-flex min-h-10 items-center gap-2 text-12 font-semibold text-secondary-500 transition-colors hover:text-primary-600"
        >
          <ArrowRight className="h-4 w-4" />
          {backLabel}
        </Link>
        <h1 className="text-28 font-bold text-secondary-950">ملف العميل</h1>
        <p className="mt-1 text-13 font-medium text-secondary-400">
          بيانات ثابتة للعميل، وتحته سجل مستقل لكل رحلة.
        </p>
      </header>

      <CustomerInfo
        client={customer}
        trip={selectedTrip}
        documentsCount={selectedTrip ? documentsCount : undefined}
        editHref={editHref}
      />

      <section className="rounded-[18px] border border-[#d4dfeb] bg-[#e8eef5] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-18 font-bold text-secondary-950">
              رحلات العميل
            </h2>
            <p className="mt-1 text-11 text-secondary-400">
              اختر رحلة لعرض مستنداتها وملاحظاتها.
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-11 font-semibold text-secondary-500">
            {customer.trips_count === 1
              ? 'رحلة واحدة'
              : `${customer.trips_count} رحلات`}
          </span>
        </div>

        {customer.trips.length === 0 ? (
          <p className="py-8 text-center text-13 text-secondary-400">
            لا توجد رحلات لهذا العميل.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {customer.trips.map((trip) => {
              const active = trip.id === selectedTrip?.id;

              return (
                <Link
                  key={trip.id}
                  href={`${tripBaseHref}?trip=${trip.id}`}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-xl border p-4 transition ${
                    active
                      ? 'border-primary-400 bg-primary-500 text-white shadow-sm'
                      : 'border-[#cfdbe8] bg-white text-secondary-900 hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-13">
                      رحلة {formatLongDate(trip.created_at)}
                    </strong>
                    <span
                      className={`text-10 ${active ? 'text-white/75' : 'text-secondary-400'}`}
                    >
                      {trip.currency}
                    </span>
                  </div>
                  <strong
                    className={`mt-3 block text-15 ${active ? 'text-white' : 'text-primary-600'}`}
                  >
                    {formatMoney(trip.trip_price, trip.currency)}
                  </strong>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {selectedTrip ? (
        <>
          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-18 font-bold text-secondary-950">
                  مستندات الرحلة المحددة
                </h2>
                <p className="mt-1 text-11 text-secondary-400">
                  جواز السفر ثابت، وباقي الملفات تخص هذه الرحلة.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-11 font-semibold text-secondary-500">
                {documentsCount} ملفات مرفقة
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {documents.map((document) => (
                <ReadFileCard key={document.name} {...document} />
              ))}
            </div>
          </section>

          <section className="grid grid-cols-[auto_1fr] gap-3 rounded-[18px] border border-[#d4dfeb] bg-[#e8eef5] p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-primary-500">
              <MessageSquareText className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-14 font-bold text-secondary-950">
                ملاحظات الرحلة
              </h2>
              <p className="mt-1 text-12 leading-7 text-secondary-600">
                {clientDocs[0]?.notes?.trim() ||
                  'لا توجد ملاحظات مضافة لهذه الرحلة.'}
              </p>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default CustomerFileView;
