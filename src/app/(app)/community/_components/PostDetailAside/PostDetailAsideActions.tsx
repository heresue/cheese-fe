'use client';

import { useState } from 'react';

import { Button } from '@/components/common/Button';

import LikeOutlineIcon from '@/assets/icons/common/like-outline.svg';
import LikeFilledIcon from '@/assets/icons/common/like-filled.svg';
import ShareIcon from '@/assets/icons/common/contact.svg';

import { ApplyInfo } from '@/components/community/jobs/types';

type PostDetailAsideActionsProps = {
  initialIsLiked: boolean;
  apply: ApplyInfo;
  buttonText?: string;
};

export function PostDetailAsideActions({
  initialIsLiked,
  apply,
  buttonText = '지원하기',
}: PostDetailAsideActionsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleToggleLike = () => {
    setIsLiked((prev) => !prev);
  };

  const handleApplyClick = () => {
    if (apply.type === 'homepage') {
      window.open(apply.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // TODO: direct 지원 모달 열기
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outlineGray"
        onClick={handleToggleLike}
        size={54}
        width={46}
        className="border-gray-400"
      >
        {isLiked ? (
          <LikeFilledIcon className="text-error-subtle w-[14px]" />
        ) : (
          <LikeOutlineIcon className="w-[14px] text-gray-500" />
        )}
      </Button>

      <Button size={54} width={182} onClick={handleApplyClick} className="flex gap-3">
        <ShareIcon className="h-[13px]" />
        {buttonText}
      </Button>
    </div>
  );
}
