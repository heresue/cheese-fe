import CancelBoxIcon from '@/assets/icons/settings/cancel-box.svg';
import CheckBoxIcon from '@/assets/icons/settings/check-box.svg';
import DoubleArrowBoxIcon from '@/assets/icons/settings/double-arrow-box.svg';

export type ProblemStatusIconType = 'correct' | 'incorrect' | 'skipped';

type ProblemStatusIconProps = {
  type: ProblemStatusIconType;
  className?: string;
};

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export default function ProblemStatusIcon({ type, className }: ProblemStatusIconProps) {
  const iconClassName = cn('block h-[24px] w-[24px] shrink-0', className);

  if (type === 'correct') {
    return <CheckBoxIcon className={iconClassName} aria-hidden="true" focusable="false" />;
  }

  if (type === 'incorrect') {
    return <CancelBoxIcon className={iconClassName} aria-hidden="true" focusable="false" />;
  }

  return <DoubleArrowBoxIcon className={iconClassName} aria-hidden="true" focusable="false" />;
}
