'use client';

import { useId, useRef, useState } from 'react';

import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import MypageModalLayout from './MypageModalLayout';

import PlusIcon from '@/assets/icons/common/plus.svg';

import type { ProfileDocument } from '@/types/profile';

type DocumentEditModalProps = {
  title: string;
  inputLabel: string;
  document?: ProfileDocument;
  isOpen: boolean;
  disabled: boolean;
  onClose: () => void;
  onSave: (document: ProfileDocument) => void;
};

export default function DocumentEditModal({
  title,
  inputLabel,
  document,
  isOpen,
  disabled,
  onClose,
  onSave,
}: DocumentEditModalProps) {
  const formId = useId();

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState(document?.fileName ?? '');
  const [url, setUrl] = useState(document?.url ?? '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    if (disabled) return;

    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (disabled) return;

    // TODO: 실제 파일 업로드 후 서버에서 받은 URL로 교체
    // - 현재 파일 업로드 API가 이미지 형식만 지원하여 문서 파일은 실제 업로드되지 않음
    // - 문서 업로드 API 지원 후 file 선택 시 업로드하고 응답 fileUrl을 저장하도록 수정 필요
    const nextDocument: ProfileDocument = {
      ...document,
      fileName,
      url,
    };

    onSave(nextDocument);
  };

  return (
    <MypageModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      submitFormId={formId}
      disabled={disabled}
    >
      <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.hwp"
            className="hidden"
            disabled={disabled}
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] ?? null;

              setFile(selectedFile);
              setFileName(selectedFile?.name ?? '');
            }}
          />

          <Input
            label={`${inputLabel} 파일`}
            value={fileName}
            readOnly
            disabled={disabled}
            placeholder="파일 첨부"
            className="h-10 px-2"
            inputClassName="cursor-default truncate"
            onClick={handleFileButtonClick}
            rightAddon={
              <Button
                type="button"
                variant="outline"
                size={28}
                paddingX={12}
                disabled={disabled}
                className="text-secondary-700 border-secondary-600 gap-1 border"
                onClick={handleFileButtonClick}
              >
                <PlusIcon className="h-2 w-2" />
                가져오기
              </Button>
            }
          />
        </div>

        <Input
          label={`${inputLabel} URL`}
          placeholder="URL 입력"
          value={url}
          disabled={disabled}
          className="h-10 px-2"
          onChange={(e) => setUrl(e.target.value)}
        />
      </form>
    </MypageModalLayout>
  );
}
