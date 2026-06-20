'use client';

import { useState } from 'react';

import { BaseModal } from '@/components/common/Modal';

import ApplyFormContent from '../../jobs/_components/ApplyFormContent';
import ApplyCompleteContent from '../../jobs/_components/ApplyCompleteContent';

import CloseIcon from '@/assets/icons/common/close.svg';

import type { JobPost } from '@/components/community/jobs/types';
import { GroupPost } from '@/components/community/groups/types';
import GroupApplyFormContent from '@/app/(app)/community/groups/_components/GroupApplyFormContent';

export type ApplyModalProps = {
  post: JobPost | GroupPost;
  isOpen: boolean;
  onClose: () => void;
};

// TODO: 채용공고 PR Merge 후 공통 컴포넌트화
export default function GroupApplyModal({ post, isOpen, onClose }: ApplyModalProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleApplyClick = () => {
    setIsCompleted(true);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <section className="bg-bg-white flex w-[540px] flex-col gap-[10px] rounded-xl border border-gray-400 px-8 pt-5 pb-15">
        <header className="flex justify-end">
          <button type="button" onClick={onClose} aria-label="닫기" className="py-[7px]">
            <CloseIcon className="w-4 text-gray-700" />
          </button>
        </header>

        {isCompleted ? (
          <ApplyCompleteContent title={post.title} />
        ) : (
          <GroupApplyFormContent post={post} onClose={onClose} onApply={handleApplyClick} />
        )}
      </section>
    </BaseModal>
  );
}
