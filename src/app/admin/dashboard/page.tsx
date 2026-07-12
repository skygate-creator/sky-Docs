import React, { Suspense } from 'react';
import getUsersCount from '../../../../lib/Helper/getUsersCount';
import BoxAnlayses from '@/_Components/BoxAnlayses/BoxAnlayses';
import { Banknote, Users } from 'lucide-react';
import getClientsCount from '../../../../lib/Helper/getClientsCount';
import getAllClients from '../../../../lib/Helper/getAllClients';
import AdminRecintClients from '@/_Components/Admin_components/AdminRecentClients/AdminRecintClients';

const dashboard = async () => {
  const employeecount = await getUsersCount();
  const clientsCount = await getClientsCount();
  const allClients = await getAllClients();

  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <Suspense fallback={<span className="loader"></span>}>
          <BoxAnlayses text="عدد الموظفين" price={employeecount} icon={Users} />
        </Suspense>
        <Suspense fallback={<span className="loader"></span>}>
          <BoxAnlayses
            text="عدد العملاء"
            price={clientsCount}
            icon={Banknote}
          />
        </Suspense>
      </div>
      {/* <Suspense fallback={<span className="loader"></span>}> */}
      <AdminRecintClients clients={allClients} />
      {/* </Suspense> */}
    </div>
  );
};

export default dashboard;
