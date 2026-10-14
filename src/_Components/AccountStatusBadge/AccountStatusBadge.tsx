interface AccountStatusBadgeProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

const AccountStatusBadge = ({
  isActive,
  activeLabel = 'نشط',
  inactiveLabel = 'موقوف',
}: AccountStatusBadgeProps) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-11 font-semibold ${
      isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}
    />
    {isActive ? activeLabel : inactiveLabel}
  </span>
);

export default AccountStatusBadge;
