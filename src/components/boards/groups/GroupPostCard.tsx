import Image from 'next/image';
import { GroupPost } from '@/components/boards/groups/types';

import LikeOutlineIcon from '@/assets/icons/common/like-outline.svg';
import LikeFilledIcon from '@/assets/icons/common/like-filled.svg';
import CommentIcon from '@/assets/icons/common/comment.svg';
import { Chip } from '@/components/common/Chip';

type GroupPostCardProps = {
  post: GroupPost;
};

const DEFAULT_PROFILE = '/profile_default.png';

export default function GroupPostCard({ post }: GroupPostCardProps) {
  return (
    <article className="flex h-[236px] w-full flex-col gap-2 rounded-[9px] border border-gray-300 p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Chip variant={post.field}>{post.field}</Chip>

          <span className="text-[12px] text-gray-600">{post.deadline}</span>
        </div>

        <h3 className="line-clamp-2 h-[60px] text-[14px] leading-[30px] font-bold">{post.title}</h3>
      </div>

      <div className="text-[14px] leading-7 text-gray-700">
        <div>모집인원: {post.recruitCount}명</div>
        <div>예상기간: {post.expectedPeriod}</div>
      </div>

      <div className="flex items-center justify-between text-[12px] leading-[26px] text-gray-600">
        <div className="flex items-center gap-2.5 pl-0.5">
          <Image
            width={24}
            height={24}
            className="line-clamp-1 inline-block rounded-full"
            src={post.author.profileImageUrl || DEFAULT_PROFILE}
            alt="작성자 프로필 이미지"
          />
          <div>{post.author.nickname} 님</div>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            {post.isLiked ? (
              <LikeFilledIcon className="text-error-subtle w-[13px]" />
            ) : (
              <LikeOutlineIcon className="w-[13px] text-gray-500" />
            )}
            <span>{post.likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <CommentIcon className="w-[15px] text-gray-500" />
            <span>{post.commentCount}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
