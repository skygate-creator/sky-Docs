import AllClintes from '@/_Components/AllClients/AllClients';
import { RecentClient } from '@/interface';
import getAllClients from '../../../../lib/Helper/getAllClients';

const CustomerPage = async () => {
  const clients: RecentClient[] = await getAllClients();

  return (
    <div className="flex w-full flex-col gap-6 p-3">
      <header>
        <h1 className="text-28 font-bold text-secondary-950">العملاء</h1>
        <p className="mt-1 text-13 font-medium text-secondary-400">
          ابحث عن أي عميل وراجع بيانات الرحلة بسهولة.
        </p>
      </header>

      <AllClintes clients={clients} />
    </div>
  );
};

export default CustomerPage;
