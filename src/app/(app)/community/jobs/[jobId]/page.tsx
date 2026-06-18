import { notFound } from 'next/navigation';

import PostDetailHeader from '../../_components/PostDetail/PostDetailHeader';
import {
  PostDetailAside,
  PostDetailAsideActions,
  PostDetailAsideInfoItem,
  PostDetailAsideProfile,
} from '../../_components/PostDetailAside';

import { APPLY_LABEL } from '@/components/community/jobs/constants';

import { jobPosts } from '@/mocks/posts';

export default async function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;

  const jobPost = jobPosts.find((post) => post.id === Number(jobId));

  if (!jobPost) {
    notFound();
  }

  const applyUrl = jobPost.apply.type === 'homepage' ? jobPost.apply.url : '-';

  const jobInfoItems = [
    { label: '모집 분야', value: 'FE, BE' },
    { label: '근무 지역', value: jobPost.location },
    { label: '사용 기술', value: jobPost.skills.join(', ') },
    {
      label: '공고 URL',
      value:
        jobPost.apply.type === 'homepage' ? (
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all underline"
          >
            {applyUrl}
          </a>
        ) : (
          '-'
        ),
    },
    { label: '고용 형태', value: jobPost.employmentType },
    { label: '지원 마감일', value: jobPost.deadline },
    { label: '지원 방법', value: APPLY_LABEL[jobPost.apply.type] },
  ];

  return (
    <div className="mb-[50px] flex gap-5">
      <section className="flex flex-1 flex-col gap-10 px-5">
        <PostDetailHeader
          title={jobPost.title}
          createdAt={jobPost.createdAt}
          viewCount={jobPost.viewCount}
        />

        <article className="flex flex-col gap-5">
          <div>이미지</div>
          <div>본문</div>
        </article>
      </section>

      <PostDetailAside
        profile={
          <PostDetailAsideProfile nickname={jobPost.author.nickname} email={jobPost.author.email} />
        }
        actions={
          <div className="flex w-full flex-col gap-5 px-3 py-5">
            <PostDetailAsideInfoItem label="지원자수" value={`${jobPost.applicantCount}명`} />
            <PostDetailAsideActions />
          </div>
        }
      >
        <div className="flex w-full flex-col gap-2 border-b border-gray-300 px-3 py-10">
          {jobInfoItems.map((item) => (
            <PostDetailAsideInfoItem key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </PostDetailAside>
    </div>
  );
}
