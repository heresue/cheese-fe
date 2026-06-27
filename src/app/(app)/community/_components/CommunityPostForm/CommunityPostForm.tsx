'use client';

import { useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import EditIcon from '@/assets/icons/common/edit.svg';
import { BackButton } from '@/components/common/BackButton';
import { Button } from '@/components/common/Button';

import { CommunityPostEditor } from '../CommunityPostEditor';
import { COMMUNITY_CATEGORY_TABS } from '../../_constants/community';

type CommunityPostFormProps = {
  children: ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, content: string) => void;
};

export default function CommunityPostForm({ children, onSubmit }: CommunityPostFormProps) {
  const [content, setContent] = useState('');

  const router = useRouter();
  const pathname = usePathname();

  const currentCategory = COMMUNITY_CATEGORY_TABS.find((tab) => pathname.startsWith(tab.value));
  const title = `${currentCategory?.label ?? '게시글'} 생성`;

  const formId = 'community-post-form';

  return (
    <div className="px-[50px]">
      <article className="mx-auto w-full max-w-[1000px] overflow-hidden rounded-[10px] border border-gray-400">
        <header className="flex items-center justify-between bg-gray-100 px-6 py-3">
          <div className="flex gap-2">
            <BackButton onClick={() => router.back()} />
            <h2 className="text-[20px] leading-[30px] font-medium">{title}</h2>
          </div>

          <Button type="submit" form={formId} width={100} size={44} paddingX={12} className="gap-3">
            <EditIcon className="w-4" aria-hidden="true" />
            등록하기
          </Button>
        </header>

        <form
          id={formId}
          onSubmit={(event) => onSubmit(event, content)}
          className="flex flex-col gap-[30px] px-25 py-8"
        >
          {children}

          <section>
            <div className="border border-gray-400">
              <CommunityPostEditor value={content} onChange={setContent} />
            </div>
          </section>
        </form>
      </article>
    </div>
  );
}
