import { notFound } from 'next/navigation';

import {
  PostDetailAside,
  PostDetailAsideActions,
  PostDetailAsideInfoItem,
  PostDetailAsideProfile,
} from '../../_components/PostDetailAside';

import ArrowIcon from '@/assets/icons/common/arrow.svg';
import ViewIcon from '@/assets/icons/common/view.svg';

import { jobPosts } from '@/mocks/posts';

export default async function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;

  const jobPost = jobPosts.find((post) => post.id === Number(jobId));

  if (!jobPost) {
    notFound();
  }

  const jobInfoItems = [
    { label: '모집 분야', value: 'FE, BE' },
    { label: '근무 지역', value: jobPost.location },
    { label: '사용 기술', value: jobPost.skills.join(', ') },
    { label: '공고 URL', value: jobPost.apply.type },
    { label: '고용 형태', value: jobPost.employmentType },
    { label: '지원 마감일', value: jobPost.deadline },
    { label: '지원 방법', value: jobPost.apply.type },
  ];

  return (
    <div className="mb-[50px] flex gap-5">
      <section className="flex flex-1 flex-col gap-10 px-5">
        <header className="flex flex-col gap-2 border-b border-gray-300 pt-8 pb-5">
          {/* TODO: BackButton 컴포넌트로 분리 후 뒤로가기 동작 연결 */}
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="뒤로가기"
              className="flex h-[30px] w-[30px] items-center justify-center"
            >
              <ArrowIcon className="h-4 text-gray-700" />
            </button>

            <h1 className="text-2xl leading-[30px] font-bold">{jobPost.title}</h1>
          </div>

          <div className="flex items-center justify-end gap-5 text-gray-600">
            <span className="text-[14px] leading-6">{jobPost.createdAt}</span>

            <div className="flex h-6 items-center gap-1">
              <ViewIcon className="w-4 text-gray-500" />
              <span className="text-[12px] leading-6 font-medium">{jobPost.viewCount}</span>
            </div>
          </div>
        </header>

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
