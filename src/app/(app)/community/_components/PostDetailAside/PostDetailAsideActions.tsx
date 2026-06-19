'use client';

import { useState } from 'react';

import { Button } from '@/components/common/Button';
import ApplyModal from '../../jobs/_components/ApplyModal';

import LikeOutlineIcon from '@/assets/icons/common/like-outline.svg';
import LikeFilledIcon from '@/assets/icons/common/like-filled.svg';
import ShareIcon from '@/assets/icons/common/contact.svg';

import type { ApplyInfo } from '@/components/community/jobs/types';

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
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleToggleLike = () => {
    setIsLiked((prev) => !prev);
  };

  const handleApplyClick = () => {
    if (apply.type === 'homepage') {
      window.open(apply.url, '_blank', 'noopener,noreferrer');
      return;
    }

    setIsApplyModalOpen(true);
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

      <ApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} />
    </div>
  );
}
