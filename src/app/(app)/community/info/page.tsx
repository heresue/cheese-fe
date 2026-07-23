'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import InfoPostCard from '@/components/community/info';

import { isInfoSort } from '../_constants/community';

import { getInfoPosts } from '@/api/mocks/community.api';
import { communityQueryKeys } from '@/queries/community/communityQueryKeys';
import { useToggleInfoPostLike } from '@/queries/community/useToggleInfoPostLike';

export default function CommunityInfoPage() {
  const searchParams = useSearchParams();

  const { mutate: toggleInfoPostLike } = useToggleInfoPostLike();

  const sortParam = searchParams.get('sort');
  const sort = isInfoSort(sortParam) ? sortParam : 'all';
  const keyword = searchParams.get('keyword') ?? '';

  const {
    data: infoPosts = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: communityQueryKeys.infoList({ sort, keyword }),
    queryFn: () => getInfoPosts({ sort, keyword }),
  });

  if (isPending) {
    return <div>불러오는 중입니다.</div>;
  }

  if (isError) {
    return <div>정보/자료공유 게시글을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="mx-auto flex flex-col px-[50px]">
      {infoPosts.map((infoPost) => (
        <InfoPostCard
          key={infoPost.id}
          post={infoPost}
          onToggleLike={toggleInfoPostLike}
          wrapperClassName="py-8"
        />
      ))}
    </div>
  );
}
