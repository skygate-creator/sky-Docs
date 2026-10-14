import { redirect } from 'next/navigation';

const employeeRequets = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  redirect(`/admin/employee/${id}`);
};

export default employeeRequets;
