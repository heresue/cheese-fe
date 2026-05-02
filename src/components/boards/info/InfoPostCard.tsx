import Image from 'next/image';
import { InfoPost } from '@/components/boards/info/types';

import ViewIcon from '@/assets/icons/common/view.svg';
import LikeOutlineIcon from '@/assets/icons/common/like-outline.svg';
import LikeFilledIcon from '@/assets/icons/common/like-filled.svg';
import CommentIcon from '@/assets/icons/common/comment.svg';

type InfoPostCardProps = {
  post: InfoPost;
};

export default function InfoPostCard({ post }: InfoPostCardProps) {
  return (
    <article className="flex w-full items-center gap-5 p-5 leading-5">
      <Image
        className="rounded-[10px] border border-gray-300"
        width={96}
        height={96}
        src={post.thumbnailUrl}
        alt="게시글 썸네일 이미지"
      />

      <div className="flex flex-col gap-3">
        <div className="flex gap-[5px] font-medium">
          <span className="text-gray-700">[{post.category}]</span>
          <h3 className="">{post.title}</h3>
        </div>

        <p className="line-clamp-2 text-[14px] font-medium text-gray-700">{post.content}</p>

        <div className="flex justify-between text-[12px] text-gray-600">
          <div>{post.tags.map((tag) => `#${tag}`).join(' ')}</div>

          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <ViewIcon className="w-4 text-gray-500" />
              <span>{post.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              {post.isLiked ? (
                <LikeFilledIcon className="text-error-subtle w-[14px]" />
              ) : (
                <LikeOutlineIcon className="w-[14px] text-gray-500" />
              )}
              <span>{post.likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <CommentIcon className="w-4 text-gray-500" />
              <span>{post.commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
