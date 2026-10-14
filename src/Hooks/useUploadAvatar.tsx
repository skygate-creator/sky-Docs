'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '../../lib/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { validateAvatarFile } from '@/Utils/fileValidation';

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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || user.id !== userId || bucketName !== 'usersImages') {
      throw new Error('تعذر التحقق من هوية المستخدم');
    }

    const validationError = validateAvatarFile(file);
    if (validationError) throw new Error(validationError);

    const fileExtByMime: Record<string, string> = {
      'image/jpeg': 'jpeg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    const fileName = `${user.id}.${fileExtByMime[file.type]}`;

    // 2️⃣ نرفع الصورة
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, { upsert: true, contentType: file.type });

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

    const staleAvatarPaths = ['jpg', 'jpeg', 'png', 'webp']
      .map((extension) => `${user.id}.${extension}`)
      .filter((path) => path !== fileName);
    const { error: cleanupError } = await supabase.storage
      .from(bucketName)
      .remove(staleAvatarPaths);

    if (cleanupError) {
      throw new Error('تم رفع الصورة الجديدة، لكن تعذر حذف الصورة القديمة.');
    }

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
