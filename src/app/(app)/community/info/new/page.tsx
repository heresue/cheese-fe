'use client';

import { useRef, useState } from 'react';

import { Input } from '@/components/common/Input';

import { CommunityPostForm } from '../../_components/CommunityPostForm';
import { FormField, FormDropdown, POST_INPUT_CLASS } from '../../_components/CommunityPostForm';

import { INFO_SORT_OPTIONS } from '../../_constants/community';
import { cn } from '@/lib/cn';
import { Button } from '@/components/common/Button';

import UploadIcon from '@/assets/icons/common/upload.svg';

const INFO_CATEGORY_OPTIONS = INFO_SORT_OPTIONS.filter((option) => option.value !== 'all');

export default function InfoCreatePage() {
  const [category, setCategory] = useState('');
  const [fileNames, setFileNames] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  // TODO: 파일 추가 업로드 및 삭제 기능 구현
  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    setFileNames(Array.from(files, (file) => file.name));

    event.target.value = '';
  };

  return (
    <CommunityPostForm>
      <section className="flex flex-col gap-[30px]">
        <Input
          label="제목"
          name="title"
          placeholder="제목"
          className={cn(POST_INPUT_CLASS, 'h-16 border-0 text-[24px]')}
          inputClassName="font-medium leading-16 h-16"
        />

        <div className="flex flex-col gap-y-6">
          <FormField label="분류" labelClassName="text-[14px]" className="w-full max-w-[300px]">
            <FormDropdown value={category} options={INFO_CATEGORY_OPTIONS} onChange={setCategory} />
          </FormField>

          <div className="flex flex-col gap-2">
            <span className="text-[14px]">첨부파일</span>
            {fileNames.length > 0 && (
              <div className="flex flex-col gap-1">
                {fileNames.map((fileName, index) => (
                  <span key={`${fileName}-${index}`} className="text-[14px] text-gray-700">
                    {fileName}
                  </span>
                ))}
              </div>
            )}

            <input
              ref={fileInputRef}
              multiple
              type="file"
              className="hidden"
              onChange={handleChangeFile}
            />
            <Button
              type="button"
              width={90}
              size={46}
              variant="outlineLightGray"
              className="gap-3 border-gray-300"
              onClick={handleOpenFilePicker}
            >
              <UploadIcon className="w-3" aria-hidden="true" />
              업로드
            </Button>
          </div>

          {/* TODO: 태그 기능 구현 */}
          <FormField
            label="태그 등록"
            labelClassName="text-[14px]"
            className="w-full max-w-[624px]"
          >
            <Input
              label="태그 등록"
              name="tags"
              placeholder="# 최대 5개의 태그를 설정할 수 있습니다"
              className={POST_INPUT_CLASS}
              inputClassName="font-medium"
            />
          </FormField>
        </div>
      </section>
    </CommunityPostForm>
  );
}
