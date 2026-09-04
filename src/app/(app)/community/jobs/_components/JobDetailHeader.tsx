'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import PostDetailHeader from '../../_components/PostDetail';

import { useCurrentUser } from '@/queries/auth/useCurrentUser';
import { useMypage } from '@/queries/mypage/useMypage';
import { useDeleteJobPost } from '@/queries/community/useDeleteJobPost';

import type { JobPost } from '@/types/community/community';

type JobDetailHeaderProps = {
  jobId: string;
  jobPost: JobPost;
};

export default function JobDetailHeader({ jobId, jobPost }: JobDetailHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  const { data: user } = useCurrentUser();
  const { data: mypage } = useMypage(user?.id);
  const { mutate: deleteJobPost, isPending: isDeletePending } = useDeleteJobPost();

  const isMine =
    (jobPost.author.profileType === 'personal' &&
      jobPost.author.id === mypage?.personalProfile.id) ||
    (jobPost.author.profileType === 'company' && jobPost.author.id === mypage?.companyProfile.id);

  return (
    <PostDetailHeader
      title={jobPost.title}
      createdAt={jobPost.createdAt}
      viewCount={jobPost.viewCount}
      isMine={isMine}
      isMenuOpen={isMenuOpen}
      onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
      onCloseMenu={() => setIsMenuOpen(false)}
      onEdit={() => router.push(`/community/jobs/${jobId}/edit`)}
      onDelete={() => {
        if (!user || isDeletePending) return;

        const confirmed = window.confirm('삭제하시겠습니까?');
        if (!confirmed) return;

        deleteJobPost(
          { jobId, userId: user.id },
          {
            onSuccess: () => {
              router.push('/community/jobs');
            },
          },
        );
      }}
    />
  );
}
