import ArrowIcon from '@/assets/icons/common/arrow.svg';
import { cn } from '@/lib/cn';

type DashboardCarouselNavButtonProps = {
  label: string;
  direction: 'left' | 'right';
  onClick: () => void;
};

export default function DashboardCarouselNavButton({
  label,
  direction,
  onClick,
}: DashboardCarouselNavButtonProps) {
  const isLeft = direction === 'left';

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'border-border text-dashboard-gray hover:border-secondary-600 hover:text-dashboard-black absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white opacity-0 shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
        isLeft ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2',
      )}
    >
      <ArrowIcon
        aria-hidden="true"
        focusable="false"
        className={cn('h-4 w-[9px] shrink-0', !isLeft && 'rotate-180')}
      />
    </button>
  );
}
