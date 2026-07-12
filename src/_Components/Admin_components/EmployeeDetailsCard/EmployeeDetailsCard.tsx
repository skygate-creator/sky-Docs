import { Profile } from '@/interface';
import Image from 'next/image';
import React from 'react';
import { ShieldCheck } from 'lucide-react';

const EmployeeDetailsCard = ({
  user,
  userClientsLength,
}: {
  user: Profile;
  userClientsLength: number;
}) => {
  return (
    <div className="flex justify-between items-center p-5 border-2 border-secondary-200 rounded-lg w-full">
      <div className="personal flex items-center gap-3">
        <div className="img relative w-32 h-32 overflow-hidden">
          <Image
            src={user.avatar_url ?? '/login_img.webp'}
            alt="employee_img"
            fill
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <div className="details flex flex-col gap-2">
          <h3 className="text-24 font-bold text-primary-500">{user.name}</h3>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-green-700" />
            <p className="text-secondary-400 font-medium text-16">
              {user.job_title}
            </p>
          </div>
        </div>
      </div>
      <div className="more_info bg-neutral-200 p-5 rounded-lg flex flex-col gap-2 justify-center items-center">
        <h3 className="text-16 font-medium text-secondary-400">عدد العملاء</h3>
        <p className="text-24 font-bold text-primary-500">
          {userClientsLength}
        </p>
      </div>
    </div>
  );
};

export default EmployeeDetailsCard;
