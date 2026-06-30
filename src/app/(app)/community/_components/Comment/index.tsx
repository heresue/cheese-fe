'use client';

import { useEffect, useRef, useState } from 'react';

import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

import { mockAccountSettings, mockPersonalProfile } from '@/mocks/profile/profiles';
import { infoComments } from '@/mocks/posts';

export default function Comment() {
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);

  const [commentList, setCommentList] = useState(infoComments);
  const [commentValue, setCommentValue] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

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
          email: mockAccountSettings.email,
          profileImageUrl: mockPersonalProfile.profileImageUrl,
        },
        content: trimmedComment,
      },
    ]);

    setCommentValue('');
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

  const editingTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingCommentId !== null) {
      editingTextareaRef.current?.focus();
    }
  }, [editingCommentId]);

  return (
    <section className="text-[14px] leading-5">
      <CommentForm
        value={commentValue}
        onValueChange={setCommentValue}
        onSubmit={handleSubmitComment}
      />

      <ul className="mt-6 flex flex-col gap-4">
        {commentList.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isMine={comment.author.id === mockPersonalProfile.id}
            isEditing={editingCommentId === comment.id}
            isMenuOpen={openCommentId === comment.id}
            editingValue={editingValue}
            textareaRef={editingTextareaRef}
            onToggleMenu={(commentId) => {
              setOpenCommentId((prev) => (prev === commentId ? null : commentId));
            }}
            onStartEdit={(comment) => {
              setEditingCommentId(comment.id);
              setEditingValue(comment.content);
              setOpenCommentId(null);
            }}
            onChangeEditingValue={setEditingValue}
            onUpdate={handleUpdateComment}
            onCancelEdit={() => {
              setEditingCommentId(null);
              setEditingValue('');
            }}
            onDelete={(commentId) => {
              setCommentList((prev) => prev.filter((item) => item.id !== commentId));
              setOpenCommentId(null);
            }}
          />
        ))}
      </ul>
    </section>
  );
}
