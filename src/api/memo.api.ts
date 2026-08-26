import { apiClient } from '@/api/client';

import type { Memo, MemoColor } from '@/app/(app)/memo/_types/memo';

type MemoResponse = {
  id: string;
  title: string;
  contentHtml: string;
  contentText: string;
  color?: MemoColor | null;
  pinned: boolean;
  deleted: boolean;
  imageUrl?: string | null;
  imageFileId?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type MemoDraft = {
  title: string;
  contentHtml: string;
  contentText: string;
  color?: MemoColor | null;
  pinned?: boolean;
  imageFileId?: string | null;
};

type GetMemosParams = {
  userId: string;
  deleted?: boolean;
  signal?: AbortSignal;
};

type GetWidgetMemosParams = {
  userId: string;
  limit?: number;
  signal?: AbortSignal;
};

type CreateMemoParams = {
  userId: string;
  draft: MemoDraft;
};

type MemoMutationParams = {
  userId: string;
  memoId: string;
};

type UpdateMemoParams = MemoMutationParams & {
  draft: Omit<MemoDraft, 'pinned'>;
};

type UpdateMemoPinParams = MemoMutationParams & {
  pinned: boolean;
};

function toMemo(response: MemoResponse): Memo {
  return {
    id: response.id,
    title: response.title,
    content: response.contentHtml,
    contentText: response.contentText,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    color: response.color ?? undefined,
    pinned: response.pinned,
    imageSrc: response.imageUrl ?? undefined,
    imageFileId: response.imageFileId ?? undefined,
    selected: false,
    deleted: response.deleted,
    deletedAt: response.deletedAt ?? undefined,
  };
}

export async function getMemos({ userId, deleted = false, signal }: GetMemosParams) {
  const memos = await apiClient<MemoResponse[]>('/backend-api/memos', {
    method: 'GET',
    query: { userId, deleted: String(deleted) },
    signal,
    cache: 'no-store',
  });

  return memos.map(toMemo);
}

export async function getWidgetMemos({ userId, limit = 5, signal }: GetWidgetMemosParams) {
  const memos = await apiClient<MemoResponse[]>('/backend-api/memos/widget', {
    method: 'GET',
    query: { userId, limit: String(limit) },
    signal,
    cache: 'no-store',
  });

  return memos.map(toMemo);
}

export async function createMemo({ userId, draft }: CreateMemoParams) {
  const memo = await apiClient<MemoResponse>('/backend-api/memos', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      ...draft,
    }),
  });

  return toMemo(memo);
}

export async function updateMemo({ userId, memoId, draft }: UpdateMemoParams) {
  const memo = await apiClient<MemoResponse>(`/backend-api/memos/${memoId}`, {
    method: 'PATCH',
    query: { userId },
    body: JSON.stringify(draft),
  });

  return toMemo(memo);
}

export async function updateMemoPin({ userId, memoId, pinned }: UpdateMemoPinParams) {
  const memo = await apiClient<MemoResponse>(`/backend-api/memos/${memoId}/pin`, {
    method: 'PATCH',
    query: { userId },
    body: JSON.stringify({ pinned }),
  });

  return toMemo(memo);
}

export async function deleteMemo({ userId, memoId }: MemoMutationParams) {
  const memo = await apiClient<MemoResponse>(`/backend-api/memos/${memoId}`, {
    method: 'DELETE',
    query: { userId },
  });

  return toMemo(memo);
}

export async function restoreMemo({ userId, memoId }: MemoMutationParams) {
  const memo = await apiClient<MemoResponse>(`/backend-api/memos/${memoId}/restore`, {
    method: 'POST',
    query: { userId },
  });

  return toMemo(memo);
}

export function permanentDeleteMemo({ userId, memoId }: MemoMutationParams) {
  return apiClient<{ success: boolean }>(`/backend-api/memos/${memoId}/permanent`, {
    method: 'DELETE',
    query: { userId },
  });
}
