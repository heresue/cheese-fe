'use client';

import Link from 'next/link';

import JobApplyAction from '@/components/community/jobs/JobApplyAction';
import { formatDeadline } from '@/lib/formatDeadline';

import LikeOutlineIcon from '@/assets/icons/common/like-outline.svg';
import LikeFilledIcon from '@/assets/icons/common/like-filled.svg';

import type { JobPost } from '@/types/community';
import { getOptionLabel } from '@/lib/getOptionLabel';
import {
  EDUCATION_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
} from '@/app/(app)/community/_constants/community';

type JobPostCardProps = {
  post: JobPost;
  onDirectApply: () => void;
  onToggleLike: (postId: number) => void;
};

export default function JobPostCard({ post, onDirectApply, onToggleLike }: JobPostCardProps) {
  const educationLabel = getOptionLabel(EDUCATION_OPTIONS, post.education);
  const employmentTypeLabel = getOptionLabel(EMPLOYMENT_TYPE_OPTIONS, post.employmentType);

  const jobConditions = [post.career, educationLabel, post.location, employmentTypeLabel];

  return (
    <article className="flex h-[146px] items-center justify-between border-b border-gray-300 p-5">
      <div className="flex w-[150px] items-center gap-1">
        <span className="w-fit max-w-[130px] leading-5 font-bold break-all">
          {post.companyName}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(post.id);
          }}
        >
          {post.isLiked ? (
            <LikeFilledIcon className="text-error-subtle w-[14px]" />
          ) : (
            <LikeOutlineIcon className="w-[14px] text-gray-500" />
          )}
        </button>
      </div>

      <div className="mx-7 flex flex-1 flex-col gap-2">
        <Link href={`/community/jobs/${post.id}`} className="w-fit">
          <h3 className="leading-5 font-bold">{post.title}</h3>
        </Link>

        <div className="text-[14px] leading-[30px] font-medium text-gray-700">
          필요스킬: {post.skills.join(', ')}
        </div>
        <ul className="flex">
          {jobConditions.map((item, i) => (
            <li key={i} className="flex items-center">
              <span className="text-[12px] text-gray-600">{item}</span>
              {i !== jobConditions.length - 1 && <div className="mx-3 h-[10px] w-px bg-gray-300" />}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-center gap-2">
        <JobApplyAction apply={post.apply} onDirectApply={onDirectApply} />
        <span className="text-[12px] leading-5 text-gray-700">{formatDeadline(post.deadline)}</span>
      </div>
    </article>
  );
}
