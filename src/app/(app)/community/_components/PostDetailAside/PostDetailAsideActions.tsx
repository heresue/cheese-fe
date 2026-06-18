import { Button } from '@/components/common/Button';

import LikeIcon from '@/assets/icons/common/like-outline.svg';
import ShareIcon from '@/assets/icons/common/contact.svg';

type PostDetailAsideActionsProps = {
  buttonText?: string;
};

export function PostDetailAsideActions({ buttonText = '지원하기' }: PostDetailAsideActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outlineGray" size={54} width={46} className="border-gray-400 text-gray-500">
        <LikeIcon className="w-[14px]" />
      </Button>

      <Button size={54} width={182} className="flex gap-3">
        <ShareIcon className="h-[13px]" />
        {buttonText}
      </Button>
    </div>
  );
}
