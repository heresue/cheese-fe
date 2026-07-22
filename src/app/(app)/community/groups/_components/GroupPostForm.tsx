'use client';

import { useState } from 'react';

import { Input } from '@/components/common/Input';
import DatePicker from '@/components/common/DatePicker/DatePicker';

import {
  CommunityPostForm,
  FormDropdown,
  FormField,
  POST_INPUT_CLASS,
} from '../../_components/CommunityPostForm';

import { cn } from '@/lib/cn';
import { toFieldArray, toFieldSelectValue, type FieldSelectValue } from '@/lib/jobField';
import { FIELD_OPTIONS, WORK_METHOD_OPTIONS } from '@/constants/profileOptions';

import type { GroupPost } from '@/types/community';

type GroupPostFormProps = {
  mode: 'create' | 'edit';
  initialValues?: GroupPost;
};

export default function GroupPostForm({ mode, initialValues }: GroupPostFormProps) {
  const [field, setField] = useState(toFieldSelectValue(initialValues?.field));
  const [progressType, setProgressType] = useState(initialValues?.progressType ?? '');

  const [date, setDate] = useState(initialValues?.deadline ?? '');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>, content: string) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const title = String(formData.get('title') ?? '');
    const expectedPeriod = String(formData.get('period') ?? '');
    const skills = String(formData.get('skills') ?? '')
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
    const recruitCount = Number(formData.get('recruitCount') ?? 0);

    const groupPostPayload = {
      title,
      field: toFieldArray(field),
      progressType,
      expectedPeriod,
      skills,
      recruitCount,
      deadline: date,
      content,
    };

    if (mode === 'create') {
      // TODO: 생성 API + 게시글 상세 페이지로 이동
      alert('게시글이 등록되었습니다.');
      return;
    }

    // TODO: 수정 API + 게시글 상세 페이지로 이동
    alert('게시글이 수정되었습니다.');
  };

  return (
    <CommunityPostForm
      mode={mode}
      onSubmit={handleSubmit}
      initialContent={initialValues?.content ?? ''}
    >
      <section className="flex flex-col gap-[30px]">
        <FormField label="제목" required>
          <Input
            label="제목"
            name="title"
            placeholder="제목 입력"
            defaultValue={initialValues?.title ?? ''}
            className={POST_INPUT_CLASS}
            inputClassName="font-medium"
            hideMessageSpace
          />
        </FormField>

        <div className="grid grid-cols-2 gap-x-15 gap-y-6">
          <FormField label="모집분야" labelClassName="text-[14px]">
            <FormDropdown
              value={field}
              options={FIELD_OPTIONS}
              onChange={(value) => setField(value as FieldSelectValue)}
            />
          </FormField>

          <FormField label="진행방식" labelClassName="text-[14px]">
            <FormDropdown
              value={progressType}
              options={WORK_METHOD_OPTIONS}
              onChange={setProgressType}
            />
          </FormField>

          <FormField label="예상 기간" labelClassName="text-[14px]">
            <Input
              label="예상 기간"
              name="period"
              placeholder="예상 기간 입력"
              defaultValue={initialValues?.expectedPeriod ?? ''}
              className={POST_INPUT_CLASS}
              inputClassName="font-medium"
              hideMessageSpace
            />
          </FormField>

          <FormField label="필요스킬" labelClassName="text-[14px]">
            <Input
              label="필요스킬"
              name="skills"
              placeholder="예) React, TypeScript"
              defaultValue={initialValues?.skills?.join(', ') ?? ''}
              className={POST_INPUT_CLASS}
              inputClassName="font-medium"
              hideMessageSpace
            />
          </FormField>

          <FormField label="모집 인원" labelClassName="text-[14px]">
            <Input
              label="모집 인원"
              type="number"
              min={1}
              name="recruitCount"
              placeholder="모집 인원 입력"
              defaultValue={initialValues?.recruitCount ?? ''}
              className={POST_INPUT_CLASS}
              inputClassName="font-medium"
              hideMessageSpace
            />
          </FormField>

          <FormField label="지원 마감일" labelClassName="text-[14px]">
            <DatePicker
              value={date}
              onChange={setDate}
              formatDisplayValue={(value) => value.replaceAll('-', '. ')}
              buttonClassName={cn('border-b border-gray-400', POST_INPUT_CLASS)}
            />
          </FormField>
        </div>
      </section>
    </CommunityPostForm>
  );
}
