'use client';

import { useMutation } from '@tanstack/react-query';
import { createClient } from '../../lib/supabase/client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface LoginData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const supabase = createClient();
  const router = useRouter();

  const loginFn = async ({ email, password }: LoginData) => {
    // Login
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) throw authError;

    // Update last login
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        last_login: authData.user.last_sign_in_at,
      })
      .eq('id', authData.user.id);

    if (updateError) throw updateError;

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    // Check if account is active
    if (!profile.is_active) {
      await supabase.auth.signOut();
      throw new Error('تم تعطيل هذا الحساب، يرجى التواصل مع الإدارة.');
    }

    return profile;
  };

  return useMutation({
    mutationKey: ['login'],
    mutationFn: loginFn,

    onSuccess: (profile) => {
      toast.success('تم تسجيل الدخول بنجاح', {
        position: 'top-center',
      });

      // if (profile.role === 'admin') {
      //   router.replace('/admin/dashboard');
      // } else {
      //   router.replace('/employee/dashboard');
      // }

      router.refresh();
    },

    onError: (error: any) => {
      toast.error(error.message || 'فشل تسجيل الدخول', {
        position: 'top-center',
      });
    },
  });
};
