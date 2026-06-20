import Link from 'next/link';
import Image from 'next/image';

import { cn } from '@/lib/cn';

import ViewIcon from '@/assets/icons/common/view.svg';
import LikeOutlineIcon from '@/assets/icons/common/like-outline.svg';
import LikeFilledIcon from '@/assets/icons/common/like-filled.svg';
import CommentIcon from '@/assets/icons/common/comment.svg';

import type { InfoPost } from '@/components/community/info/types';

type InfoPostCardProps = {
  post: InfoPost;
  wrapperClassName?: string;
  onToggleLike: (postId: number) => void;
};

export default function InfoPostCard({ post, wrapperClassName, onToggleLike }: InfoPostCardProps) {
  return (
    <article className={cn('border-b border-gray-300 p-5 leading-5', wrapperClassName)}>
      <Link href={`/community/info/${post.id}`} className="flex w-full items-center gap-5">
        <Image
          className="h-24 w-24 shrink-0 rounded-[10px] border border-gray-300 object-cover"
          width={96}
          height={96}
          src={post.thumbnailUrl}
          alt="게시글 썸네일 이미지"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex gap-[5px] truncate font-medium">
            <span className="text-gray-700">[{post.category}]</span>
            <h3 className="truncate">{post.title}</h3>
          </div>

          <p className="line-clamp-2 h-10 text-[14px] font-medium text-gray-700">{post.content}</p>

          <div className="flex justify-between gap-4 text-[12px] text-gray-600">
            <div className="min-w-0 truncate">{post.tags.map((tag) => `#${tag}`).join(' ')}</div>

            <div className="flex shrink-0 gap-2">
              <div className="flex items-center gap-1">
                <ViewIcon className="w-4 text-gray-500" />
                <span>{post.viewCount}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(post.id);
                }}
                className="flex items-center gap-1"
              >
                {post.isLiked ? (
                  <LikeFilledIcon className="text-error-subtle w-[14px]" />
                ) : (
                  <LikeOutlineIcon className="w-[14px] text-gray-500" />
                )}
                <span>{post.likeCount}</span>
              </button>

              <div className="flex items-center gap-1">
                <CommentIcon className="w-4 text-gray-500" />
                <span>{post.commentCount}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
