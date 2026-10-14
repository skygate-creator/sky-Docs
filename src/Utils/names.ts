interface InitialsOptions {
  fallback?: string;
  separator?: string;
}

export const getInitials = (
  name: string,
  { fallback = '؟', separator = ' ' }: InitialsOptions = {},
) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return fallback;

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join(separator);
};
