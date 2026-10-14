import { redirect } from 'next/navigation';

const dispatcher = () => {
  redirect('/dispatcher/newRequest');
};

export default dispatcher;
