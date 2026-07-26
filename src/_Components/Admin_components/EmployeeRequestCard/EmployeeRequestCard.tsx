import { Request } from '@/interface';
import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  X,
  Phone,
  MapPin,
  Users,
  Plane,
  MessageSquare,
  Calendar,
  Clock,
} from 'lucide-react';

const EmployeeRequestCard = ({
  setIsOpen,
  request,
}: {
  setIsOpen: () => void;
  request: Request;
}) => {
  return (
    <div className="w-screen h-screen fixed top-0 right-0 bg-black/50 backdrop-blur-sm drop-shadow-sm flex items-center justify-center z-[60]">
      <div
        dir="rtl"
        className="w-full max-w-md bg-white rounded-2xl p-6 flex flex-col gap-4 relative mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={setIsOpen}
          className="absolute left-4 top-4 text-neutral-400 hover:text-neutral-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-18 font-bold text-secondary-900">تفاصيل الطلب</h3>

        <div className="flex flex-col gap-3">
          {/* رقم الهاتف */}
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-primary-600 shrink-0" />
            <div>
              <p className="text-12 text-neutral-500">رقم الهاتف</p>
              <p className="text-14 font-bold text-secondary-900">
                {request.phone}
              </p>
            </div>
          </div>

          {/* الوجهة */}
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-primary-600 shrink-0" />
            <div>
              <p className="text-12 text-neutral-500">الدولة</p>
              <p className="text-14 font-bold text-secondary-900">
                {request.destination}
              </p>
            </div>
          </div>

          {/* المطارات */}
          <div className="flex items-center gap-3">
            <Plane className="h-4 w-4 text-primary-600 shrink-0" />
            <div>
              <p className="text-12 text-neutral-500">مطار المغادرة والوصول</p>
              <p className="text-14 font-bold text-secondary-900">
                {request.departure_airport} ← {request.arrival_airport}
              </p>
            </div>
          </div>

          {/* عدد المسافرين */}
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-primary-600 shrink-0" />
            <div>
              <p className="text-12 text-neutral-500">عدد المسافرين</p>
              <p className="text-14 font-bold text-secondary-900">
                {request.passengers}
              </p>
            </div>
          </div>

          {/* التاريخ والوقت */}
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-primary-600 shrink-0" />
            <div>
              <p className="text-12 text-neutral-500">تاريخ الطلب</p>
              <p className="text-14 font-bold text-secondary-900">
                {request.created_at &&
                  format(new Date(request.created_at), 'd MMMM yyyy', {
                    locale: ar,
                  })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-primary-600 shrink-0" />
            <div>
              <p className="text-12 text-neutral-500">التوقيت</p>
              <p className="text-14 font-bold text-secondary-900">
                {request.created_at &&
                  format(new Date(request.created_at), 'hh:mm a', {
                    locale: ar,
                  })}
              </p>
            </div>
          </div>

          {/* نوع الرحلة ومصدر العميل */}
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
            <span className="rounded-full bg-primary-100 text-primary-600 text-12 font-bold px-3 py-1">
              {request.trip_type}
            </span>
            <span className="rounded-full bg-neutral-100 text-neutral-600 text-12 font-bold px-3 py-1">
              {request.lead_source}
            </span>
          </div>

          {/* ملاحظات العميل */}
          {request.customer_notes && (
            <div className="flex items-start gap-3 pt-2 border-t border-neutral-100">
              <MessageSquare className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-12 text-neutral-500">ملاحظات العميل</p>
                <p className="text-14 text-secondary-700">
                  {request.customer_notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeRequestCard;
