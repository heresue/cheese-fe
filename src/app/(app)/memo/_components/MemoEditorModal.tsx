'use client';

import { useRef, useState } from 'react';

import CreateIcon from '@/assets/icons/common/create.svg';
import DeleteIcon from '@/assets/icons/common/delete.svg';
import EditIcon from '@/assets/icons/common/edit.svg';

import { MemoRichEditor } from './MemoRichEditor';
import type { Memo, MemoColor } from '../_types/memo';

type MemoEditorModalProps = {
  open: boolean;
  memo?: Memo | null;
  onClose: () => void;
  onSubmit: (
    memo: Omit<Memo, 'id' | 'createdAt'> & Partial<Pick<Memo, 'id' | 'createdAt'>>,
  ) => void;
};

type MemoEditorModalContentProps = {
  memo?: Memo | null;
  onClose: () => void;
  onSubmit: MemoEditorModalProps['onSubmit'];
};

const colorOptions: Array<{ color: MemoColor; className: string }> = [
  { color: 'gray', className: 'bg-[#93A1AF]' },
  { color: 'pink', className: 'bg-[#EB5B49]' },
  { color: 'orange', className: 'bg-[#F4C340]' },
  { color: 'green', className: 'bg-[#9CC04B]' },
  { color: 'blue', className: 'bg-[#5B9EF7]' },
  { color: 'purple', className: 'bg-[#9B59D0]' },
];

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12.78 2.6 17.4 7.22l-2.16 2.16-1.62-.54-2.92 2.92.54 3.78-.82.82-3.18-3.18-3.64 3.64-.82-.82 3.64-3.64-3.18-3.18.82-.82 3.78.54 2.92-2.92-.54-1.62L12.78 2.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12.5 4 6.5 10l6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhotoPlaceholder() {
  return (
    <div className="flex h-[260px] w-[450px] items-center justify-center bg-gray-100 text-gray-600">
      <div className="flex flex-col items-center">
        <svg
          viewBox="0 0 160 120"
          fill="none"
          aria-hidden="true"
          className="mb-[8px] h-[110px] w-[160px]"
        >
          <path
            d="M28 94V37h26l8-12h37l8 12h25v57H28Z"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          <circle cx="80" cy="66" r="22" stroke="currentColor" strokeWidth="7" />
          <path d="M25 16 139 108" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        </svg>

        <span className="text-[32px] leading-[38px] font-bold text-gray-600">No photo</span>
      </div>
    </div>
  );
}

function MemoImagePreview({ src }: { src: string }) {
  return (
    <div
      aria-hidden="true"
      className="h-[260px] w-[450px] bg-gray-100 bg-cover bg-center"
      style={{
        backgroundImage: `url(${src})`,
      }}
    />
  );
}

function MemoEditorModalContent({ memo, onClose, onSubmit }: MemoEditorModalContentProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState(memo?.title ?? '');
  const [content, setContent] = useState(memo?.content ?? '');
  const [color, setColor] = useState<MemoColor>(memo?.color ?? 'gray');
  const [pinned, setPinned] = useState(Boolean(memo?.pinned));
  const [imageSrc, setImageSrc] = useState(memo?.imageSrc ?? '');

  const handleUploadImage = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(String(reader.result));
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageSrc('');
  };

  const handleSubmit = () => {
    onSubmit({
      id: memo?.id,
      createdAt: memo?.createdAt,
      title: title.trim() || '제목',
      content: content.trim(),
      color,
      pinned,
      imageSrc: imageSrc || undefined,
      selected: memo?.selected,
      deleted: memo?.deleted,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-transparent pt-[150px]">
      <section className="h-[780px] w-[990px] overflow-hidden rounded-[8px] border border-gray-300 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
        <header className="flex h-[66px] items-center justify-between border-b border-gray-300 px-[32px]">
          <div className="flex items-center gap-[16px]">
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex h-[28px] w-[28px] items-center justify-center text-gray-700"
            >
              <ArrowLeftIcon className="h-[24px] w-[24px]" />
            </button>

            <h2 className="text-[20px] leading-[30px] font-medium text-gray-950">메모</h2>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-secondary-700 flex h-[44px] w-[104px] items-center justify-center gap-[8px] rounded-[10px] text-[14px] font-medium text-white"
          >
            <CreateIcon className="h-[16px] w-[16px]" aria-hidden="true" />
            {memo ? '수정하기' : '생성하기'}
          </button>
        </header>

        <div className="flex h-[54px] items-center justify-between border-b border-gray-300 px-[32px]">
          <div className="flex items-center gap-[10px]">
            <span className="text-[12px] leading-[18px] font-medium text-gray-500">
              메모 색상 설정
            </span>

            <div className="flex items-center gap-[8px]">
              {colorOptions.map((option) => (
                <button
                  key={option.color}
                  type="button"
                  aria-label={`${option.color} 색상 선택`}
                  onClick={() => setColor(option.color)}
                  className={`h-[20px] w-[20px] rounded-[5px] border ${
                    color === option.color ? 'border-gray-800' : 'border-transparent'
                  } ${option.className}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-[22px] text-gray-600">
            <button
              type="button"
              aria-label="고정"
              onClick={() => setPinned((prev) => !prev)}
              className={pinned ? 'text-secondary-700' : 'text-gray-600'}
            >
              <PinIcon className="h-[20px] w-[20px]" />
            </button>

            <button
              type="button"
              aria-label="이미지 추가"
              onClick={() => imageInputRef.current?.click()}
              className="text-gray-600"
            >
              <EditIcon className="h-[20px] w-[20px]" aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label="이미지 삭제"
              onClick={handleRemoveImage}
              disabled={!imageSrc}
              className="text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <DeleteIcon className="h-[20px] w-[20px]" aria-hidden="true" />
            </button>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                handleUploadImage(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
          </div>
        </div>

        <div className="px-[64px] pt-[48px]">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목"
            className="mb-[38px] h-[34px] w-full bg-transparent text-[24px] leading-[34px] font-bold text-gray-950 outline-none placeholder:text-gray-500"
          />

          {imageSrc ? <MemoImagePreview src={imageSrc} /> : <PhotoPlaceholder />}
        </div>

        <MemoRichEditor value={content} onChange={setContent} />
      </section>
    </div>
  );
}

export function MemoEditorModal({ open, memo, onClose, onSubmit }: MemoEditorModalProps) {
  if (!open) return null;

  return (
    <MemoEditorModalContent
      key={memo?.id ?? 'create'}
      memo={memo}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
