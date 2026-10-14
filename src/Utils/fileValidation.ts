export const MAX_DOCUMENT_FILE_SIZE = 20 * 1024 * 1024;
export const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;

const avatarMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const validatePdfFile = (file: File) => {
  if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
    return 'من فضلك اختر ملف PDF صحيح';
  }

  if (file.size > MAX_DOCUMENT_FILE_SIZE) {
    return 'حجم ملف PDF يجب ألا يتجاوز 20 ميجابايت';
  }

  return null;
};

export const validateAvatarFile = (file: File) => {
  if (!avatarMimeTypes.has(file.type)) {
    return 'الصورة يجب أن تكون JPG أو PNG أو WEBP';
  }

  if (file.size > MAX_AVATAR_FILE_SIZE) {
    return 'حجم الصورة يجب ألا يتجاوز 5 ميجابايت';
  }

  return null;
};

export const getSafeFileName = (fileName: string) => {
  const extension = fileName.toLowerCase().endsWith('.pdf') ? '.pdf' : '';
  const baseName = fileName
    .slice(0, extension ? -extension.length : undefined)
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}._-]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);

  return `${baseName || 'document'}${extension}`;
};
