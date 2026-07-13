'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '../../lib/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface UploadAvatarParams {
  file: File;
  userId: string;
  bucketName?: string;
}

const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const uploadAvatar = async ({
    file,
    userId,
    bucketName = 'usersImages',
  }: UploadAvatarParams) => {
    const supabase = createClient();

    // 1️⃣ نطلع الامتداد الحقيقي
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;

    // 2️⃣ نرفع الصورة
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, { upsert: true });

    // نجلب الصورة
    if (uploadError) throw uploadError;
    const { data: imgurl } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    if (!imgurl?.publicUrl) return '/login_img.webp';

    // 3️⃣ نخزّن اسم الملف في البروفايل
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        avatar_url: imgurl.publicUrl,
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    return `${imgurl.publicUrl}?t=${Date.now()}`;
  };

  return useMutation({
    mutationKey: ['uploadAvatar'],
    mutationFn: uploadAvatar,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['user-avatar', variables.userId],
      });
      toast.success('تم رفع الصورة بنجاح', { position: 'top-center' });
      router.refresh();
    },
    onError: (e: any) => {
      toast.error(e.message || 'فشل رفع الصورة', {
        position: 'top-center',
      });
    },
  });
};

export default useUploadAvatar;
