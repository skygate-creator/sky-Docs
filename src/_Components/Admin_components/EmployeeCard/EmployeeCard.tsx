import { Profile } from '@/interface';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const EmployeeCard = ({ user }: { user: Profile }) => {
  return (
    <div className="p-5 flex flex-col items-center gap-5 border-2 border-secondary-200 rounded-lg">
      <div className="img w-28 h-28 rounded-full relative">
        <Image
          src={user.avatar_url ?? '/login_img.webp'}
          fill
          alt="employee_img"
          className="w-full h-full rounded-full"
        />
      </div>
      <div className="title flex flex-col justify-center items-center gap-1">
        <h3 className="employee_name text-24">{user.name}</h3>
        <p className="job_title text-16 text-secondary-400">{user.job_title}</p>
      </div>
      <Link
        href={`/admin/employee/${user.id}`}
        className="btn w-full bg-primary-600 p-2 rounded-lg text-white text-center"
      >
        عرض العملاء
      </Link>
    </div>
  );
};

export default EmployeeCard;
