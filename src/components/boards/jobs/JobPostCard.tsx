'use client';

import Link from 'next/link';
import JobApplyAction from '@/components/boards/jobs/JobApplyAction';
import { JobPost } from './types';

type JobPostCardProps = {
  post: JobPost;
  onDirectApply: () => void;
};

export default function JobPostCard({ post, onDirectApply }: JobPostCardProps) {
  const jobConditions = [post.career, post.education, post.location, post.employmentType];

  return (
    <article className="flex items-center justify-between border-b border-gray-300 p-5">
      <div className="w-[130px] leading-5 font-bold break-words">{post.companyName}</div>

      <div className="mx-7 flex flex-1 flex-col gap-2">
        {/* 게시글 링크 연결 필요 */}
        <Link href="" className="w-fit">
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
        <span className="text-[12px] leading-5 text-gray-700">{post.deadline}</span>
      </div>
    </article>
  );
}
