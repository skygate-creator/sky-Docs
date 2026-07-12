import AddUserForm from '@/_Components/AddUserForm/AddUserForm';
import BoxAnlayses from '@/_Components/BoxAnlayses/BoxAnlayses';
import RecentClients from '@/_Components/RecentClient/RecentClient';
import { RecentClient } from '@/interface';
import getRecentClientAdded from '../../../../lib/Helper/getRecentClientAdded';
// import { Users, Banknote } from 'lucide-react';

const dashboard = async () => {
  const clients: RecentClient[] = await getRecentClientAdded();

  return (
    <section className="p-5 bg-neutral-50 h-screen">
      <div className="flex flex-col gap-5">
        {/* <div className="grid grid-cols-2 gap-3">
          <BoxAnlayses text="عدد العملاء" price={1250} icon={Users} />
          <BoxAnlayses text="إجمالي المبيعات" price={150000} icon={Banknote} />
        </div> */}
        <AddUserForm />
        <RecentClients clients={clients} />
      </div>
    </section>
  );
};

export default dashboard;
