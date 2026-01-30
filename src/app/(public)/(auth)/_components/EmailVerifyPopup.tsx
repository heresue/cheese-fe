import { BasePopup } from '@/components/common/Popup';
import EmailVerifyForm, { EmailVerifyBaseProps } from './EmailVerifyForm';
import Image from 'next/image';

type EmailVerifyPopupProps = EmailVerifyBaseProps & {
  isOpen: boolean;
  onClose: () => void;
};

export default function EmailVerifyPopup({
  isOpen,
  onClose,
  title,
  description,
  onNext,
}: EmailVerifyPopupProps) {
  return (
    <BasePopup isOpen={isOpen} onClose={onClose}>
      <div className="flex w-[457px] flex-col gap-10 rounded-[25px] bg-gray-50 px-14 py-10">
        <div>
          <Image src="/brands/cheese-logo.svg" alt="CHEESE" width={125} height={34} priority />
        </div>

        <EmailVerifyForm
          title={title}
          description={description}
          onNext={() => {
            onNext?.();
            onClose();
          }}
        />
      </div>
    </BasePopup>
  );
}
