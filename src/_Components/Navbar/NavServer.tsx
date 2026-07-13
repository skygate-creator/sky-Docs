import getUserProfile from '../../../lib/Helper/getUserProfile';
import NavClient from './NavClient';

const NavServer = async () => {
  const user = await getUserProfile();

  if (!user) return null;
  return (
    <NavClient
      id={user.id}
      name={user.name}
      job={user.job_title}
      user_avatar={user.avatar_url}
    />
  );
};

export default NavServer;
