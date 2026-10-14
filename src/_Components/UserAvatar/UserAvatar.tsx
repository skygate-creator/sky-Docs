import Image from 'next/image';

const sizeStyles = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
};

const shapeStyles = {
  circle: 'rounded-full',
  rounded: 'rounded-xl',
  large: 'rounded-2xl',
};

interface UserAvatarProps {
  name: string;
  src?: string | null;
  size?: keyof typeof sizeStyles;
  shape?: keyof typeof shapeStyles;
  className?: string;
}

const UserAvatar = ({
  name,
  src,
  size = 'md',
  shape = 'rounded',
  className = '',
}: UserAvatarProps) => (
  <span
    className={`relative block shrink-0 overflow-hidden bg-secondary-100 ${sizeStyles[size]} ${shapeStyles[shape]} ${className}`}
  >
    <Image
      src={src ?? '/login_img.webp'}
      alt={`صورة ${name}`}
      fill
      sizes={size === 'lg' ? '80px' : size === 'md' ? '56px' : '40px'}
      className="object-cover object-top"
    />
  </span>
);

export default UserAvatar;
