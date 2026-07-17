'use client';

import Image from 'next/image';
import { useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';

import ArrowIcon from '@/assets/icons/common/arrow.svg';
import CreateIcon from '@/assets/icons/common/create.svg';
import MemoDeleteIcon from '@/assets/icons/memo/delete.svg';
import MemoPictureIcon from '@/assets/icons/memo/picture.svg';
import MemoPinIcon from '@/assets/icons/memo/pin.svg';
import MemoPinFilledIcon from '@/assets/icons/memo/pin-filled.svg';
import { CollapsibleColorPicker } from '@/components/common/CollapsibleColorPicker';

import { MemoRichEditor } from './MemoRichEditor';
import { getMemoTagColor, MEMO_COLOR_OPTIONS } from '../_constants/memoColors';
import type { Memo, MemoColor } from '../_types/memo';

type MemoEditorModalProps = {
  open: boolean;
  memo?: Memo | null;
  onClose: () => void;
  onSubmit: (
    memo: Omit<Memo, 'id' | 'createdAt'> & Partial<Pick<Memo, 'id' | 'createdAt'>>,
  ) => void;
  onDelete: (id: string) => void;
};

type MemoEditorModalContentProps = {
  memo?: Memo | null;
  onClose: () => void;
  onSubmit: MemoEditorModalProps['onSubmit'];
  onDelete: MemoEditorModalProps['onDelete'];
};

const NO_PICTURE_IMAGE_SRC = '/images/nopicture.png';

const MEMO_COLOR_PICKER_OPTIONS = MEMO_COLOR_OPTIONS.map((option) => ({
  value: option.color,
  label: option.label,
  swatchClassName: getMemoTagColor(option.color)?.chipClassName,
}));

function PhotoPlaceholder() {
  return (
    <div className="relative h-[260px] w-[450px] overflow-hidden bg-gray-100">
      <Image
        src={NO_PICTURE_IMAGE_SRC}
        alt="No photo"
        fill
        priority={false}
        sizes="450px"
        className="object-cover"
      />
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

function removeContentImages(html: string) {
  return html.replace(/<img\b[^>]*>/gi, '').trim();
}

function MemoEditorModalContent({
  memo,
  onClose,
  onSubmit,
  onDelete,
}: MemoEditorModalContentProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState(memo?.title ?? '');
  const [content, setContent] = useState(removeContentImages(memo?.content ?? ''));
  const [color, setColor] = useState<MemoColor | undefined>(memo?.color);
  const [pinned, setPinned] = useState(Boolean(memo?.pinned));
  const [imageSrc, setImageSrc] = useState(memo?.imageSrc ?? '');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleBackdropMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    onClose();
  };

  const openImagePicker = () => {
    imageInputRef.current?.click();
  };

  const handleUploadImage = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(String(reader.result));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onSubmit({
      id: memo?.id,
      createdAt: memo?.createdAt,
      title: title.trim() || '제목',
      content: removeContentImages(content),
      color,
      pinned,
      imageSrc: imageSrc || undefined,
      selected: memo?.selected,
      deleted: memo?.deleted,
    });

    onClose();
  };

  const handleConfirmDelete = () => {
    if (memo?.id) {
      onDelete(memo.id);
    }

    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-start justify-center bg-transparent pt-[150px]"
      onMouseDown={handleBackdropMouseDown}
    >
      <section className="flex h-[780px] w-[990px] flex-col overflow-hidden rounded-[8px] border border-gray-300 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
        <header className="flex h-[66px] shrink-0 items-center justify-between border-b border-gray-300 bg-gray-100 px-[32px]">
          <div className="flex items-center gap-[16px]">
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex h-[28px] w-[28px] items-center justify-center text-gray-700"
            >
              <ArrowIcon className="h-[24px] w-[14px]" aria-hidden="true" />
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

        <div className="flex h-[54px] shrink-0 items-center justify-between border-b border-gray-300 px-[32px]">
          <div className="flex items-center gap-[10px]">
            <span className="text-[12px] leading-[18px] font-medium text-gray-500">
              메모 색상 설정
            </span>

            <CollapsibleColorPicker
              value={color}
              options={MEMO_COLOR_PICKER_OPTIONS}
              onChange={setColor}
            />
          </div>

          <div className="flex items-center gap-[22px] text-gray-600">
            <button
              type="button"
              aria-label="고정"
              onClick={() => setPinned((prev) => !prev)}
              className="flex h-[20px] w-[20px] items-center justify-center"
            >
              {pinned ? (
                <MemoPinFilledIcon
                  className="block h-[20px] w-[20px] shrink-0 text-gray-950"
                  aria-hidden="true"
                />
              ) : (
                <MemoPinIcon
                  className="block h-[20px] w-[20px] shrink-0 text-gray-600"
                  aria-hidden="true"
                />
              )}
            </button>

            <button
              type="button"
              aria-label="대표 이미지 추가"
              onClick={openImagePicker}
              className="flex h-[20px] w-[20px] items-center justify-center text-gray-600"
            >
              <MemoPictureIcon className="block h-[20px] w-[20px] shrink-0" aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label="메모 삭제"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="flex h-[20px] w-[20px] items-center justify-center text-gray-600"
            >
              <MemoDeleteIcon className="block h-[20px] w-[20px] shrink-0" aria-hidden="true" />
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

        <MemoRichEditor value={content} onChange={setContent}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목"
            className="mb-[38px] h-[34px] w-full bg-transparent text-[24px] leading-[34px] font-bold text-gray-950 outline-none placeholder:text-gray-500"
          />

          {imageSrc ? <MemoImagePreview src={imageSrc} /> : <PhotoPlaceholder />}
        </MemoRichEditor>
      </section>

      {isDeleteConfirmOpen ? (
        <div
          className="bg-overlay-dim absolute inset-0 z-[60] flex items-center justify-center"
          onMouseDown={(event) => {
            event.stopPropagation();

            if (event.target === event.currentTarget) {
              setIsDeleteConfirmOpen(false);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="memo-delete-confirm-title"
            className="w-[340px] rounded-[10px] border border-gray-300 bg-white px-[24px] py-[22px] shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
          >
            <h3
              id="memo-delete-confirm-title"
              className="text-[16px] leading-[24px] font-medium text-gray-950"
            >
              메모를 삭제하시겠습니까?
            </h3>

            <div className="mt-[24px] flex justify-end gap-[8px]">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex h-[36px] items-center justify-center rounded-[8px] border border-gray-300 px-[16px] text-[14px] font-medium text-gray-700"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-error flex h-[36px] items-center justify-center rounded-[8px] px-[16px] text-[14px] font-medium text-white"
              >
                삭제
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export function MemoEditorModal({ open, memo, onClose, onSubmit, onDelete }: MemoEditorModalProps) {
  if (!open) return null;

  return (
    <MemoEditorModalContent
      key={memo?.id ?? 'create'}
      memo={memo}
      onClose={onClose}
      onSubmit={onSubmit}
      onDelete={onDelete}
    />
  );
}
