import getCustomerById from '../../../../../../lib/Helper/getCustomerById';
import CustomerInfo from '@/_Components/CustomerInfo/CustomerInfo';
import getClientDocs from '../../../../../../lib/Helper/getClientDocs';
import getClientDocumentsSignedUrls from '../../../../../../lib/Helper/getClientDocumentUrls';
import ReadFileCard from '@/_Components/ReadFileCard/ReadFileCard';
import {
  Plane,
  PlaneTakeoff,
  Hotel,
  Car,
  BriefcaseBusiness,
  BadgeCheck,
  Building2,
  Bus,
  MessageSquareText,
} from 'lucide-react';
import { notFound } from 'next/navigation';

const ClientInfo = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const customerDetails = await getCustomerById(id);

  if (!customerDetails) notFound();
  const selectedTrip = customerDetails.trips[0];
  const clientDocs = selectedTrip
    ? await getClientDocs(selectedTrip.id, customerDetails.id)
    : [];

  const data = await getClientDocumentsSignedUrls(clientDocs[0]);
  const documentsCount = Object.values(data).filter(Boolean).length;

  return (
    <section className="flex flex-col gap-5 p-3">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h3 className="text-24 font-bold text-primary-500">
          تفاصيل بيانات العميل
        </h3>

        <p className="text-16 font-medium text-secondary-400">
          عرض شامل لمعلومات العميل والمستندات المرتبطة بالرحلة لضمان جودة الخدمة
        </p>
      </div>

      <CustomerInfo client={customerDetails} trip={selectedTrip} documentsCount={documentsCount} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ReadFileCard
          icon={<Plane className="h-6 w-6" />}
          name="تذكرة الطيران الدولي"
          fileName="تذكرة الطيران الدولي"
          fileUrl={data.flight_path || ''}
        />

        <ReadFileCard
          icon={<PlaneTakeoff className="h-6 w-6" />}
          name="تذكرة الطيران الداخلي"
          fileName="تذكرة الطيران الداخلي"
          fileUrl={data.inside_flight_path || ''}
        />

        <ReadFileCard
          icon={<Hotel className="h-6 w-6" />}
          name="قسيمة الفندق"
          fileName="قسيمة الفندق"
          fileUrl={data.voucher_path || ''}
        />

        <ReadFileCard
          icon={<Car className="h-6 w-6" />}
          name="حجز السيارة"
          fileName="حجز السيارة"
          fileUrl={data.car_path || ''}
        />

        <ReadFileCard
          icon={<BriefcaseBusiness className="h-6 w-6" />}
          name="الباقة السياحية"
          fileName="الباقة السياحية"
          fileUrl={data.package_path || ''}
        />

        <ReadFileCard
          icon={<BadgeCheck className="h-6 w-6" />}
          name="جواز السفر"
          fileName="جواز السفر"
          fileUrl={data.passport_path || ''}
        />

        <ReadFileCard
          icon={<Building2 className="h-6 w-6" />}
          name="بيانات المورد"
          fileName="بيانات المورد"
          fileUrl={data.supplier_info_path || ''}
        />

        <ReadFileCard
          icon={<Bus className="h-6 w-6" />}
          name="تحويلات العملاء"
          fileName="تحويلات العملاء"
          fileUrl={data.customer_transfers_path || ''}
        />
      </div>

      <div className="flex flex-col">
          <div className="flex items-center gap-2 rounded-t-2xl bg-neutral-300 p-2">
            <MessageSquareText className="h-5 w-5 text-primary-400" />

            <h3 className="text-16 font-bold text-secondary-900">
              ملاحظات العميل
            </h3>
          </div>

          <div className="h-40 w-full rounded-b-2xl border border-neutral-300 bg-white p-4">
            <p className="text-14 font-bold text-secondary-900">
              {clientDocs[0]?.notes?.trim() ||
                'لا توجد ملاحظات مضافة لهذه الرحلة.'}
            </p>
          </div>
      </div>
    </section>
  );
};

export default ClientInfo;
