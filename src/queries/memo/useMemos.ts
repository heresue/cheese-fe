import { useQuery } from '@tanstack/react-query';

import { getMemos, getWidgetMemos } from '@/api/memo.api';

import { memoQueryKeys } from './memoQueryKeys';

import type { Memo } from '@/app/(app)/memo/_types/memo';

const WIDGET_MEMO_LIMIT = 5;

type UseMemosParams = {
  userId?: string;
  enabled: boolean;
};

export type MemoQueryData = {
  memos: Memo[];
  widgetMemos: Memo[];
};

export function useMemos({ userId, enabled }: UseMemosParams) {
  return useQuery({
    queryKey: memoQueryKeys.data(userId ?? ''),
    queryFn: async ({ signal }): Promise<MemoQueryData> => {
      if (!userId) {
        return { memos: [], widgetMemos: [] };
      }

      const [activeMemos, deletedMemos, widgetMemos] = await Promise.all([
        getMemos({ userId, signal }),
        getMemos({ userId, deleted: true, signal }),
        getWidgetMemos({ userId, limit: WIDGET_MEMO_LIMIT, signal }),
      ]);

      return {
        memos: [...activeMemos, ...deletedMemos],
        widgetMemos,
      };
    },
    enabled: enabled && Boolean(userId),
  });
}
