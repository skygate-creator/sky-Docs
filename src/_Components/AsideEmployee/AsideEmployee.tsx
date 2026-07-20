'use client';
import { aside } from '@/interface';
import { LayoutDashboard, Users, Globe, StickyNote } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AsideEmployee = () => {
  const data: aside[] = [
    {
      name: 'الصفحة الرئيسية',
      icon: LayoutDashboard,
      href: '/employee/dashboard',
    },
    { name: 'العملاء', icon: Users, href: '/employee/customer' },
    { name: 'الريكويستات', icon: StickyNote, href: '/employee/newRequest' },
  ];
  const pathname = usePathname();
  return (
    <div className="border-l border-secondary-200 min-h-screen bg-neutral-100 px-8 fixed top-0 ">
      <div className="flex flex-col gap-5 sticky top-5">
        <div className="title py-2">
          <div className="flex items-center gap-2 text-primary-600 mb-2">
            <span className="w-10 h-10 bg-primary-600 flex justify-center items-center rounded-md">
              <Globe className="w-6 h-6 text-white" />
            </span>
            <h2 className="font-bold text-28">سكاي جيت</h2>
          </div>
          <p className="text-secondary-400 font-medium text-18">
            نظام إدارة العملاء
          </p>
        </div>
        <div className="flex flex-col gap-5">
          {data.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                key={index}
                className={`${pathname.startsWith(item.href) ? 'bg-primary-400 text-white' : ''} font-semibold text-neutral-700 flex items-center justify-between gap-3 mx-2 p-2 rounded-md hover:bg-primary-400 hover:text-white duration-200`}
              >
                <p>{item.name}</p>
                <Icon className="w-6 h-6" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AsideEmployee;
