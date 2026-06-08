import DrawIcon from '@/assets/icons/draw.svg';

type ProblemActionIconProps = {
  className?: string;
};

export default function ProblemActionIcon({ className }: ProblemActionIconProps) {
  return <DrawIcon className={className} aria-hidden="true" focusable="false" />;
}
