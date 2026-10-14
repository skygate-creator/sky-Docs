import React from 'react';
import getUserProfile from '../../lib/Helper/getUserProfile';
import { redirect } from 'next/navigation';

const Home = async () => {
  const user = await getUserProfile();
  if (user.role === 'admin') {
    redirect('/admin/dashboard');
  }
  if (user.role === 'dispatcher') {
    redirect('/dispatcher/newRequest');
  }
  redirect('/employee/dashboard');
};

export default Home;
