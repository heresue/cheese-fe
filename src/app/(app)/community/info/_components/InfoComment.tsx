'use client';

import { useState } from 'react';

import { Input, InputActionButton } from '@/components/common/Input';
import { ProfileImage } from '@/components/common/ProfileImage';

import MoreIcon from '@/assets/icons/common/more.svg';

import { mockPersonalProfile } from '@/mocks/profile/profiles';
import { infoComments } from '@/mocks/posts';

// TODO: 댓글 수정 기능 구현
export default function InfoComment() {
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);
  const [commentList, setCommentList] = useState(infoComments);
  const [commentValue, setCommentValue] = useState('');

  const handleSubmitComment = () => {
    const trimmedComment = commentValue.trim();

    if (!trimmedComment) return;

    setCommentList((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: {
          id: mockPersonalProfile.id,
          nickname: mockPersonalProfile.nickname,
          profileImageUrl: mockPersonalProfile.profileImageUrl,
        },
        content: trimmedComment,
      },
    ]);

    setCommentValue('');
  };

  return (
    <section className="text-[14px] leading-5">
      <div className="flex gap-3">
        <ProfileImage size={40} src={mockPersonalProfile.profileImageUrl} />

        <Input
          value={commentValue}
          onChange={(e) => setCommentValue(e.target.value)}
          placeholder="댓글 등록"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmitComment();
            }
          }}
          rightAddon={
            <InputActionButton
              className="bg-secondary-600 mb-[7px] text-gray-50"
              onClick={handleSubmitComment}
            >
              등록
            </InputActionButton>
          }
        />
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {commentList.map((comment) => {
          const isMine = comment.author.id === mockPersonalProfile.id;

          return (
            <li key={comment.id} className="relative flex items-start gap-3">
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

              {/* TODO: 공통 드롭다운 교체 예정 */}
              {openCommentId === comment.id && (
                <div className="bg-bg-white absolute top-2 right-8 z-10 flex w-25 flex-col gap-2 rounded-[10px] border border-gray-400 py-3 text-[12px] leading-5">
                  {isMine ? (
                    <>
                      <button
                        type="button"
                        className="mx-3 rounded-[5px] px-2 text-left hover:bg-gray-200"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="mx-3 rounded-[5px] px-2 text-left hover:bg-gray-200"
                        onClick={() => {
                          setCommentList((prev) => prev.filter((item) => item.id !== comment.id));
                          setOpenCommentId(null);
                        }}
                      >
                        삭제
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="mx-3 rounded-[5px] px-2 text-left hover:bg-gray-200"
                    >
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
