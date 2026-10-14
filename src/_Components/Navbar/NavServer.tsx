import getUserProfile from '../../../lib/Helper/getUserProfile';
import AdminNavbar from './AdminNavbar';
import DispatcherNavbar from './DispatcherNavbar';
import EmployeeNavbar from './EmployeeNavbar';

const NavServer = async () => {
  const user = await getUserProfile();

  if (!user) return null;

  const navbarUser = {
    id: user.id,
    name: user.name,
    job: user.job_title,
    avatar: user.avatar_url,
  };

  switch (user.role) {
    case 'admin':
      return <AdminNavbar user={navbarUser} />;
    case 'employee':
      return <EmployeeNavbar user={navbarUser} />;
    case 'dispatcher':
      return <DispatcherNavbar user={navbarUser} />;
    default:
      return null;
  }
};

export default NavServer;
