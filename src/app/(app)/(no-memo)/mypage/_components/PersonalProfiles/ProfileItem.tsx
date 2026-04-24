import { Button } from '@/components/common/Button';

type ProfileItemProps = {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  buttonIcon?: React.ReactNode;
  buttonText?: string;
  buttonClassName?: string;
  onClick?: () => void;
};

export default function ProfileItem({
  label,
  value,
  icon,
  buttonIcon,
  buttonText,
  buttonClassName,
  onClick,
}: ProfileItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[15px]">
        <span className="inline-flex h-[30px] w-[30px] items-center justify-center text-gray-500">
          {icon}
        </span>

        <div className="text-[14px] leading-[30px] text-gray-700">
          <h3 className="font-bold">{label}</h3>
          {value ?? ''}
        </div>
      </div>

      <Button
        variant="outlineLightGray"
        size={38}
        paddingX={8}
        className={`gap-[7px] ${buttonClassName ?? ''}`}
        onClick={onClick}
      >
        <span className="inline-flex h-[14px] w-[14px] justify-center">{buttonIcon}</span>
        {buttonText}
      </Button>
    </div>
  );
}
