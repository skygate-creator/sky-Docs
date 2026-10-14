'use client';

import { Globe2, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavDrop from '../NavDrop/NavDrop';
import UserAvatar from '../UserAvatar/UserAvatar';

export interface NavbarUser {
  id: string;
  name: string;
  job: string;
  avatar: string | null;
}

export interface NavbarLink {
  name: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

const NavbarShell = ({
  user,
  homeHref,
  links,
}: {
  user: NavbarUser;
  homeHref: string;
  links: NavbarLink[];
}) => {
  const pathname = usePathname();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  useEffect(() => {
    setIsAccountOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#dce4ee] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1300px] flex-wrap items-center justify-between gap-3 px-3 py-3 md:flex-nowrap">
        <Link href={homeHref} className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-primary-500 text-white">
            <Globe2 className="h-5 w-5" />
          </span>
          <span className="text-20 font-bold leading-tight text-secondary-950">
            سكاي جيت
            <span className="block text-[9px] font-semibold tracking-[0.24em] text-secondary-400">
              SKY DOCS
            </span>
          </span>
        </Link>

        <nav className="order-3 flex w-full items-center justify-center gap-1 overflow-x-auto rounded-[14px] bg-[#e9eef6] p-1 md:order-none md:w-auto">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-9 shrink-0 items-center gap-1.5 rounded-[10px] px-3 text-12 font-semibold transition-colors ${
                  isActive ?
                    'bg-white text-primary-500 shadow-sm'
                  : 'text-secondary-400 hover:bg-white/70 hover:text-primary-500'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsAccountOpen((current) => !current)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 text-right transition-colors hover:bg-neutral-100"
            aria-expanded={isAccountOpen}
            aria-label="فتح قائمة الحساب"
          >
            <UserAvatar
              name={user.name}
              src={user.avatar}
              size="sm"
              shape="circle"
              className="ring-2 ring-white"
            />
            <span className="hidden sm:block">
              <strong className="block text-13 text-secondary-900">
                {user.name}
              </strong>
              <span className="block text-11 text-secondary-400">
                {user.job}
              </span>
            </span>
          </button>
          {isAccountOpen && <NavDrop id={user.id} />}
        </div>
      </div>
    </header>
  );
};

export default NavbarShell;
