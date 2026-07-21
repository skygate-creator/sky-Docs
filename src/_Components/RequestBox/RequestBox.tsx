'use client';
import { Request } from '@/interface';
import { BookMarked, MapPin, MoveLeft, Clock } from 'lucide-react';
import { formatDate } from '../../Utils/formatData';
import useUpdateRequest from '@/Hooks/useUpdateRequest';
import Link from 'next/link';
const RequestBox = ({ request }: { request: Request }) => {
  const { mutate: updateRequest, isPending } = useUpdateRequest();
  return (
    <div className="flex flex-col gap-7 p-5 rounded-2xl border-2 border-neutral-300 bg-neutral-100">
      <div className="main__details flex justify-between items-center gap-5">
        <div className="number flex gap-5 items-center">
          <span className="w-11 h-11 rounded-full bg-primary-100 flex justify-center items-center">
            <BookMarked className="w-5 h-5 text-primary-500" />
          </span>
          <div className="flex flex-col gap-2">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`https://wa.me/${request.phone}`}
              className="font-bold text-20 underline hover:text-primary-500"
            >
              {request.phone}
            </Link>
            <div className="flex items-center gap-1 text-secondary-400 ">
              <MapPin className="w-4 h-4 " />
              <p className="text-14">{request.destination}</p>
            </div>
          </div>
        </div>
        <h3 className="type px-2 py-1 rounded-lg bg-primary-500 text-white text-12">
          {request.trip_type}
        </h3>
      </div>
      <div className="passenger__direction flex justify-between items-center gap-5">
        <div className="passenger flex flex-col gap-2">
          <h4 className="text-12 text-secondary-400 px-2">تفاصيل المسافرين</h4>
          <div className="border border-neutral-300 h-10 p-5 flex justify-center items-center rounded-md text-14 bg-primary-100 ">
            {request.passengers ? request.passengers : 'لا يوجد اي  تفاصيل'}
          </div>
        </div>
        <div className="direction flex flex-col gap-2">
          <h4 className="text-12 text-secondary-400">اتجاه الرحلة</h4>
          {request.arrival_airport && request.departure_airport ?
            <div className="flex items-center gap-5">
              {request.departure_airport}{' '}
              <MoveLeft className="w-7 h- text-primary-500" />{' '}
              {request.arrival_airport}
            </div>
          : <p className="text-14">لا يوجد اي تفاصيل</p>}
        </div>
      </div>
      <div className="moreDetails w-full flex flex-col gap-2 pb-7 border-b-2 border-neutral-300">
        <h4 className="text-12 text-secondary-400 px-2">ملاحظات إضافية</h4>
        <p className="text-14 bg-secondary-100 p-5 rounded-md">
          {request.customer_notes ?
            request.customer_notes
          : 'لا يوجد اي تفاصيل إضافية'}
        </p>
      </div>
      <div className="time__confirm flex justify-between items-center gap-5">
        <div className="time flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary-500" />
          <p className="text-14">{formatDate(request.created_at)}</p>
        </div>
        <button
          onClick={() => updateRequest(request.id)}
          disabled={request.is_read || isPending}
          className={`px-5 py-2 rounded-lg text-14 text-white transition-colors duration-200 ${
            request.is_read ?
              'bg-neutral-400 cursor-not-allowed'
            : 'bg-primary-500 hover:bg-primary-600 cursor-pointer'
          }`}
        >
          {isPending ?
            <span className="loader"></span>
          : request.is_read ?
            'تم الاستلام'
          : 'استلام'}
        </button>
      </div>
    </div>
  );
};

export default RequestBox;
