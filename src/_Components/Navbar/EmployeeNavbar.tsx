'use client';

import {
  ChartNoAxesCombined,
  House,
  Inbox,
  UsersRound,
} from 'lucide-react';
import NavbarShell, { NavbarUser } from './NavbarShell';

const EmployeeNavbar = ({ user }: { user: NavbarUser }) => (
  <NavbarShell
    user={user}
    homeHref="/employee/dashboard"
    links={[
      { name: 'الرئيسية', href: '/employee/dashboard', icon: House },
      { name: 'العملاء', href: '/employee/customer', icon: UsersRound },
      { name: 'الريكويستات', href: '/employee/newRequest', icon: Inbox },
      {
        name: 'التقارير',
        href: '/employee/requestReport',
        icon: ChartNoAxesCombined,
      },
    ]}
  />
);

export default EmployeeNavbar;
