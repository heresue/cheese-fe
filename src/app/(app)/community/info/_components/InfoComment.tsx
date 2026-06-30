'use client';

import { useEffect, useRef, useState } from 'react';

import { ProfileImage } from '@/components/common/ProfileImage';
import { Button } from '@/components/common/Button';

import MoreIcon from '@/assets/icons/common/more.svg';

import { mockPersonalProfile } from '@/mocks/profile/profiles';
import { infoComments } from '@/mocks/posts';

const COMMENT_BUTTON_CLASS = 'h-9 bg-secondary-600 text-gray-50';
const COMMENT_CANCEL_BUTTON_CLASS = 'h-9 bg-gray-500 text-gray-50';

function resizeTextarea(textarea: HTMLTextAreaElement, minHeight = 30) {
  textarea.style.height = `${minHeight}px`;
  textarea.style.height = `${textarea.scrollHeight}px`;
}

export default function InfoComment() {
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);

  const [commentList, setCommentList] = useState(infoComments);
  const [commentValue, setCommentValue] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

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

    requestAnimationFrame(() => {
      if (commentTextareaRef.current) {
        commentTextareaRef.current.style.height = '30px';
      }
    });
  };

  const handleUpdateComment = (commentId: number) => {
    const trimmedValue = editingValue.trim();

    if (!trimmedValue) return;

    setCommentList((prev) =>
      prev.map((item) => (item.id === commentId ? { ...item, content: trimmedValue } : item)),
    );

    setEditingCommentId(null);
    setEditingValue('');
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingCommentId !== null) {
      textareaRef.current?.focus();
    }
  }, [editingCommentId]);

  return (
    <section className="text-[14px] leading-5">
      <div className="flex gap-3">
        <ProfileImage size={40} src={mockPersonalProfile.profileImageUrl} />

        <div className="focus-within:border-secondary-600 flex w-full items-center gap-[10px] border-b border-gray-400 pb-3 transition-colors">
          <textarea
            ref={commentTextareaRef}
            value={commentValue}
            onChange={(e) => {
              setCommentValue(e.target.value);
              resizeTextarea(e.target);
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
            placeholder="댓글 등록"
            rows={1}
            className="h-[30px] max-h-60 w-full resize-none overflow-y-auto pt-1 outline-none"
          />

          <Button onClick={handleSubmitComment} width={56} className={COMMENT_BUTTON_CLASS}>
            등록
          </Button>
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {commentList.map((comment) => {
          const isMine = comment.author.id === mockPersonalProfile.id;

          return (
            <li key={comment.id} className="relative flex items-start gap-3">
              <div className="p-[5px]">
                <ProfileImage size={30} src={comment.author.profileImageUrl} />
              </div>

              <div className="flex w-full gap-[10px]">
                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="font-medium">{comment.author.nickname}</h3>

                  {editingCommentId === comment.id ? (
                    <div className="flex flex-col gap-3 rounded-[5px] border border-gray-400 px-3 py-3">
                      <textarea
                        ref={editingCommentId === comment.id ? textareaRef : undefined}
                        value={editingValue}
                        onChange={(e) => {
                          setEditingValue(e.target.value);
                          resizeTextarea(e.target, 80);
                        }}
                        onKeyDown={(e) => {
                          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                            e.preventDefault();
                            handleUpdateComment(comment.id);
                          }
                        }}
                        className="focus:outline-secondary-600 max-h-60 min-h-20 resize-none overflow-y-auto px-2 py-2"
                      />

                      <div className="flex gap-1 self-end">
                        <Button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingValue('');
                          }}
                          width={56}
                          className={COMMENT_CANCEL_BUTTON_CLASS}
                        >
                          취소
                        </Button>

                        <Button
                          onClick={() => handleUpdateComment(comment.id)}
                          width={56}
                          className={COMMENT_BUTTON_CLASS}
                        >
                          수정
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line">{comment.content}</p>
                  )}
                </div>

                <button
                  type="button"
                  className="mt-4 flex w-[33px] justify-center"
                  onClick={() => {
                    setOpenCommentId((prev) => (prev === comment.id ? null : comment.id));
                  }}
                >
                  <MoreIcon className="h-3" />
                </button>
              </div>

              {/* TODO: 공통 드롭다운 교체 예정 */}
              {openCommentId === comment.id && (
                <div className="bg-bg-white absolute top-2 right-8 z-10 flex w-25 flex-col gap-2 rounded-[10px] border border-gray-400 py-3 text-[12px] leading-5">
                  {isMine ? (
                    <>
                      <button
                        type="button"
                        className="mx-3 rounded-[5px] px-2 text-left hover:bg-gray-200"
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditingValue(comment.content);
                          setOpenCommentId(null);
                        }}
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
