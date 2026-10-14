'use client';

import { BarChart3, LayoutDashboard, UsersRound } from 'lucide-react';
import NavbarShell, { NavbarUser } from './NavbarShell';

const AdminNavbar = ({ user }: { user: NavbarUser }) => (
  <NavbarShell
    user={user}
    homeHref="/admin/dashboard"
    links={[
      {
        name: 'الرئيسية',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: 'الموظفين',
        href: '/admin/employee',
        icon: UsersRound,
      },
      {
        name: 'الإحصائيات',
        href: '/admin/statistics',
        icon: BarChart3,
      },
    ]}
  />
);

export default AdminNavbar;
