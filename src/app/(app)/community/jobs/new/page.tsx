'use client';

import { useState } from 'react';

import { Input } from '@/components/common/Input';
import DatePicker from '@/components/common/DatePicker/DatePicker';

import { CommunityPostForm } from '../../_components/CommunityPostForm';
import { FormField, FormDropdown, POST_INPUT_CLASS } from '../../_components/CommunityPostForm';

import {
  EDUCATION_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  FIELD_OPTIONS,
} from '../../_constants/community';

import { cn } from '@/lib/cn';

export default function JobCreatePage() {
  const [field, setField] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [education, setEducation] = useState('');
  const [date, setDate] = useState('');
  return (
    <CommunityPostForm>
      <section className="flex flex-col gap-[30px]">
        <FormField label="제목" required>
          <Input
            label="제목"
            name="title"
            placeholder="제목 입력"
            className={POST_INPUT_CLASS}
            inputClassName="font-medium"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-x-15 gap-y-6">
          <FormField label="모집분야" labelClassName="text-[14px]">
            <FormDropdown value={field} options={FIELD_OPTIONS} onChange={setField} />
          </FormField>

          <FormField label="고용 형태" labelClassName="text-[14px]">
            <FormDropdown
              value={employmentType}
              options={EMPLOYMENT_TYPE_OPTIONS}
              onChange={setEmploymentType}
            />
          </FormField>

          <FormField label="근무 지역" labelClassName="text-[14px]">
            <Input
              label="근무 지역"
              name="location"
              placeholder="근무 지역 입력"
              className={POST_INPUT_CLASS}
              inputClassName="font-medium"
            />
          </FormField>

          <FormField label="학력" labelClassName="text-[14px]">
            <FormDropdown value={education} options={EDUCATION_OPTIONS} onChange={setEducation} />
          </FormField>

          <FormField label="필요스킬" labelClassName="text-[14px]">
            <Input
              label="필요 스킬"
              name="skills"
              placeholder="예) React, TypeScript"
              className={POST_INPUT_CLASS}
              inputClassName="font-medium"
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

          <FormField label="공고 URL" labelClassName="text-[14px]" className="col-span-2" required>
            <Input
              label="공고 URL"
              name="url"
              type="url"
              placeholder="URL 입력"
              className={POST_INPUT_CLASS}
            />
          </FormField>
        </div>
      </section>
    </CommunityPostForm>
  );
}
