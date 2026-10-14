import AddUserForm from '@/_Components/AddUserForm/AddUserForm';
import RecentClients from '@/_Components/RecentClient/RecentClient';
import { RecentClient } from '@/interface';
import getRecentClientAdded from '../../../../lib/Helper/getRecentClientAdded';
import getUserProfile from '../../../../lib/Helper/getUserProfile';

const dashboard = async () => {
  const [clients, user]: [RecentClient[], Awaited<
    ReturnType<typeof getUserProfile>
  >] = await Promise.all([getRecentClientAdded(), getUserProfile()]);

  return (
    <section className="min-h-[calc(100vh-76px)] bg-[#eef3f8] p-3">
      <div className="flex w-full flex-col gap-7">
        <div className="flex flex-col justify-between gap-5 rounded-[20px] border border-[#cedcff] bg-[#dfe9ff] px-6 py-6 sm:flex-row sm:items-center md:px-8">
          <div>
            <p className="mb-1 text-12 font-bold text-primary-500">
              أهلًا بعودتك، {user?.name?.split(' ')[0]}
            </p>
            <h1 className="text-28 font-bold tracking-tight text-secondary-950 md:text-35">
              مساحة ليوم أسهل.
            </h1>
            <p className="mt-1 text-13 text-secondary-400">
              أضف عملاءك وتابع تفاصيل رحلاتهم من مكان واحد.
            </p>
          </div>
          <span className="w-fit rounded-full border border-[#d3def3] bg-white/80 px-3 py-1.5 text-11 font-medium text-secondary-500">
            إدارة العملاء والرحلات
          </span>
        </div>
        <AddUserForm />
        <RecentClients clients={clients} />
      </div>
    </section>
  );
};

export default dashboard;
