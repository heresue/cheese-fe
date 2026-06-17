import { notFound } from 'next/navigation';

import ArrowIcon from '@/assets/icons/common/arrow.svg';
import ViewIcon from '@/assets/icons/common/view.svg';
import LikeIcon from '@/assets/icons/common/like-outline.svg';
import ShareIcon from '@/assets/icons/common/contact.svg';

import { jobPosts } from '@/mocks/posts';
import { Button } from '@/components/common/Button';

export default async function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;

  const jobPost = jobPosts.find((post) => post.id === Number(jobId));

  if (!jobPost) {
    notFound();
  }

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

      <aside className="flex h-[790px] w-[300px] flex-col items-center rounded-[10px] border border-gray-400 p-5 text-[14px]">
        <div className="flex w-full flex-col items-center gap-4 border-b border-gray-300 py-10">
          <div className="flex flex-col items-center gap-3">
            <div className="h-25 w-25 rounded-full bg-gray-500">프로필 이미지</div>
            <div className="flex flex-col gap-1 text-center leading-[30px]">
              <span className="text-[20px] font-bold break-words">작성자 닉네임</span>
              <span className="break-all">작성자 이메일</span>
            </div>
          </div>

          <Button fullWidth variant="outlineGray" className="border-gray-400" size={44}>
            기업 정보 알아보기
          </Button>
        </div>

        <div className="flex w-full flex-col gap-2 border-b border-gray-300 px-3 py-10">
          <div className="flex gap-8">
            <span className="w-[68px] text-gray-600">모집 분야</span>
            <span className="w-[136px]">FE, BE</span>
          </div>
          <div className="flex gap-8">
            <span className="w-[68px] text-gray-600">근무 지역</span>
            <span className="w-[136px]">{jobPost.location}</span>
          </div>
          <div className="flex gap-8">
            <span className="w-[68px] text-gray-600">사용 기술</span>
            <span className="w-[136px]">{jobPost.skills.join(', ')}</span>
          </div>
          <div className="flex gap-8">
            <span className="w-[68px] text-gray-600">공고 URL</span>
            <span className="w-[68px]">주소</span>
          </div>
          <div className="flex gap-8">
            <span className="w-[68px] text-gray-600">고용 형태</span>
            <span className="w-[136px]">{jobPost.employmentType}</span>
          </div>
          <div className="flex gap-8">
            <span className="w-[68px] text-gray-600">지원 마감일</span>
            <span className="w-[136px]">{jobPost.deadline}</span>
          </div>
          <div className="flex gap-8">
            <span className="w-[68px] text-gray-600">지원 방법</span>
            <span className="w-[136px]">홈페이지 지원</span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5 px-3 py-5">
          <div className="flex gap-8">
            <span className="w-[68px] text-gray-600">지원자수</span>
            <span>5000명</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outlineGray"
              size={54}
              width={46}
              className="border-gray-400 text-gray-500"
            >
              <LikeIcon className="w-[14px]" />
            </Button>

            <Button size={54} width={182} className="flex gap-3">
              <ShareIcon className="h-[13px]" />
              지원하기
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
