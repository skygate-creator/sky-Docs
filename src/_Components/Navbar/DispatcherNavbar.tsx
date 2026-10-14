'use client';

import { SendHorizontal } from 'lucide-react';
import NavbarShell, { NavbarUser } from './NavbarShell';

const DispatcherNavbar = ({ user }: { user: NavbarUser }) => (
  <NavbarShell
    user={user}
    homeHref="/dispatcher/newRequest"
    links={[
      {
        name: 'إضافة ريكويست',
        href: '/dispatcher/newRequest',
        icon: SendHorizontal,
      },
    ]}
  />
);

export default DispatcherNavbar;
