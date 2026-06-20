'use client';

import { useState } from 'react';

import { Input, InputActionButton } from '@/components/common/Input';
import { ProfileImage } from '@/components/common/ProfileImage';

import MoreIcon from '@/assets/icons/common/more.svg';

const currentUserId = 1;

const comments = [
  {
    id: 1,
    author: {
      id: 1,
      nickname: '유옥천',
      profileImageUrl: '/mock/profile-4.png',
    },
    content: '잘 보고 갑니다',
  },
  {
    id: 2,
    author: {
      id: 2,
      nickname: '김치즈',
      profileImageUrl: '/mock/profile-3.png',
    },
    content: '좋은 글 감사합니다',
  },
  {
    id: 3,
    author: {
      id: 2,
      nickname: '구름',
      profileImageUrl: '/mock/profile-6.png',
    },
    content: '좋아요',
  },
  {
    id: 4,
    author: {
      id: 2,
      nickname: '몽글이',
      profileImageUrl: '/mock/profile-1.png',
    },
    content: '좋네요 수고요',
  },
];

// TODO: 댓글 기능 구현
export default function InfoComment() {
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);

  return (
    <section className="text-[14px] leading-5">
      <h2 id="comments-heading" className="sr-only">
        댓글
      </h2>
      <div className="flex gap-3">
        <ProfileImage size={40} />

        <Input
          placeholder="댓글 등록"
          rightAddon={
            <InputActionButton className="bg-secondary-600 mb-[7px] text-gray-50">
              등록
            </InputActionButton>
          }
        />
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {comments.map((comment) => {
          const isMine = comment.author.id === currentUserId;

          return (
            <li key={comment.id} className="relative flex items-center gap-3">
              <div className="p-[5px]">
                <ProfileImage size={30} src={comment.author.profileImageUrl} />
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <h3 className="font-medium">{comment.author.nickname}</h3>
                <p>{comment.content}</p>
              </div>

              <button
                type="button"
                className="flex w-11 justify-center"
                onClick={() => {
                  setOpenCommentId((prev) => (prev === comment.id ? null : comment.id));
                }}
              >
                <MoreIcon className="h-3" />
              </button>

              {openCommentId === comment.id && (
                <div className="absolute top-2 right-8 z-10 flex w-[80px] flex-col rounded-[8px] border border-gray-300 bg-white py-1 text-[13px] shadow-sm">
                  {isMine ? (
                    <>
                      <button type="button" className="px-3 py-2 text-left hover:bg-gray-100">
                        수정
                      </button>
                      <button type="button" className="px-3 py-2 text-left hover:bg-gray-100">
                        삭제
                      </button>
                    </>
                  ) : (
                    <button type="button" className="px-3 py-2 text-left hover:bg-gray-100">
                      신고
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
