'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { ApiError } from '@/api/client';
import { useCurrentUser } from '@/queries/auth/useCurrentUser';
import {
  useDeleteMemoMutation,
  useDeleteSelectedMemosMutation,
  usePermanentDeleteMemoMutation,
  useRestoreMemoMutation,
  useSaveMemoMutation,
  useToggleMemoPinMutation,
} from '@/queries/memo/useMemoMutations';
import { useMemos } from '@/queries/memo/useMemos';

import type { Memo, MemoSavePayload } from '../_types/memo';

export type { MemoSavePayload } from '../_types/memo';

type MemoMutationStatus = 'success' | 'not-found' | 'loading' | 'cancelled' | 'error';

type MemoSelectionState = {
  ownerUserId: string | null;
  selectedIds: Set<string>;
};

type MemoStoreContextValue = {
  memos: Memo[];
  widgetMemos: Memo[];
  isLoading: boolean;
  errorMessage: string | null;
  saveMemo: (memo: MemoSavePayload) => Promise<MemoMutationStatus>;
  toggleSelectMemo: (id: string) => void;
  selectMemos: (ids: string[], selected: boolean) => void;
  togglePinMemo: (id: string) => Promise<MemoMutationStatus>;
  deleteMemo: (id: string) => Promise<MemoMutationStatus>;
  deleteSelectedMemos: () => Promise<MemoMutationStatus>;
  restoreMemo: (id: string) => Promise<MemoMutationStatus>;
  permanentDeleteMemo: (id: string) => Promise<MemoMutationStatus>;
};

const MemoStoreContext = createContext<MemoStoreContextValue | null>(null);
const EMPTY_MEMOS: Memo[] = [];
const EMPTY_SELECTED_IDS = new Set<string>();

function getMemoErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function getMutationErrorMessage(
  error: unknown,
  requestUserId: string | undefined,
  currentUserId: string | undefined,
  fallback: string,
) {
  if (!error || !requestUserId || requestUserId !== currentUserId) {
    return null;
  }

  return getMemoErrorMessage(error, fallback);
}

function updateSelection(
  state: MemoSelectionState,
  userId: string,
  updateSelectedIds: (selectedIds: Set<string>) => void,
): MemoSelectionState {
  const selectedIds = new Set(state.ownerUserId === userId ? state.selectedIds : []);
  updateSelectedIds(selectedIds);

  return { ownerUserId: userId, selectedIds };
}

export function MemoStoreProvider({ children }: { children: ReactNode }) {
  const {
    data: currentUser,
    error: currentUserError,
    isPending: isCurrentUserPending,
    isRefetchError: isCurrentUserRefetchError,
  } = useCurrentUser();
  const userId = currentUser?.id;
  const hasCurrentUserError = Boolean(currentUserError) || isCurrentUserRefetchError;
  const canLoadMemoData = Boolean(userId) && !hasCurrentUserError;
  const memoQuery = useMemos({ userId, enabled: canLoadMemoData });
  const saveMemoMutation = useSaveMemoMutation();
  const toggleMemoPinMutation = useToggleMemoPinMutation();
  const deleteMemoMutation = useDeleteMemoMutation();
  const deleteSelectedMemosMutation = useDeleteSelectedMemosMutation();
  const restoreMemoMutation = useRestoreMemoMutation();
  const permanentDeleteMemoMutation = usePermanentDeleteMemoMutation();
  const [selectionState, setSelectionState] = useState<MemoSelectionState>({
    ownerUserId: null,
    selectedIds: new Set(),
  });

  const selectedIds =
    selectionState.ownerUserId === userId ? selectionState.selectedIds : EMPTY_SELECTED_IDS;
  const sourceMemos = canLoadMemoData ? (memoQuery.data?.memos ?? EMPTY_MEMOS) : EMPTY_MEMOS;
  const memos = useMemo(
    () =>
      sourceMemos.map((memo) => ({
        ...memo,
        selected: selectedIds.has(memo.id),
      })),
    [selectedIds, sourceMemos],
  );
  const widgetMemos = canLoadMemoData ? (memoQuery.data?.widgetMemos ?? EMPTY_MEMOS) : EMPTY_MEMOS;
  const isMemoLoading =
    isCurrentUserPending || (canLoadMemoData && memoQuery.isPending && !memoQuery.data);

  const resetMutationErrors = useCallback(() => {
    saveMemoMutation.reset();
    toggleMemoPinMutation.reset();
    deleteMemoMutation.reset();
    deleteSelectedMemosMutation.reset();
    restoreMemoMutation.reset();
    permanentDeleteMemoMutation.reset();
  }, [
    deleteMemoMutation,
    deleteSelectedMemosMutation,
    permanentDeleteMemoMutation,
    restoreMemoMutation,
    saveMemoMutation,
    toggleMemoPinMutation,
  ]);

  const clearSelectedMemoIds = useCallback(
    (memoIds: string[]) => {
      if (!userId) return;

      setSelectionState((state) =>
        updateSelection(state, userId, (nextSelectedIds) => {
          memoIds.forEach((memoId) => nextSelectedIds.delete(memoId));
        }),
      );
    },
    [userId],
  );

  const saveMemo = useCallback(
    async (nextMemo: MemoSavePayload): Promise<MemoMutationStatus> => {
      if (isMemoLoading) {
        return 'loading';
      }

      if (!userId || hasCurrentUserError) {
        return 'error';
      }

      const currentMemo = nextMemo.id ? memos.find((memo) => memo.id === nextMemo.id) : undefined;

      if (nextMemo.id && !currentMemo) {
        return 'not-found';
      }

      resetMutationErrors();

      try {
        await saveMemoMutation.mutateAsync({
          userId,
          memo: nextMemo,
          currentMemo,
        });
        return 'success';
      } catch (error) {
        if (error instanceof ApiError && error.status === 404 && nextMemo.id) {
          saveMemoMutation.reset();
          return 'not-found';
        }

        return 'error';
      }
    },
    [hasCurrentUserError, isMemoLoading, memos, resetMutationErrors, saveMemoMutation, userId],
  );

  const toggleSelectMemo = useCallback(
    (id: string) => {
      if (!userId) return;

      setSelectionState((state) =>
        updateSelection(state, userId, (nextSelectedIds) => {
          if (nextSelectedIds.has(id)) {
            nextSelectedIds.delete(id);
          } else {
            nextSelectedIds.add(id);
          }
        }),
      );
    },
    [userId],
  );

  const selectMemos = useCallback(
    (ids: string[], selected: boolean) => {
      if (!userId) return;

      setSelectionState((state) =>
        updateSelection(state, userId, (nextSelectedIds) => {
          ids.forEach((id) => {
            if (selected) {
              nextSelectedIds.add(id);
            } else {
              nextSelectedIds.delete(id);
            }
          });
        }),
      );
    },
    [userId],
  );

  const togglePinMemo = useCallback(
    async (id: string): Promise<MemoMutationStatus> => {
      if (isMemoLoading) {
        return 'loading';
      }

      if (!userId || hasCurrentUserError) {
        return 'error';
      }

      const currentMemo = memos.find((memo) => memo.id === id);

      if (!currentMemo) {
        return 'not-found';
      }

      resetMutationErrors();

      try {
        await toggleMemoPinMutation.mutateAsync({
          userId,
          memoId: id,
          pinned: !currentMemo.pinned,
        });
        return 'success';
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          toggleMemoPinMutation.reset();
          return 'not-found';
        }

        return 'error';
      }
    },
    [hasCurrentUserError, isMemoLoading, memos, resetMutationErrors, toggleMemoPinMutation, userId],
  );

  const deleteMemo = useCallback(
    async (id: string): Promise<MemoMutationStatus> => {
      if (isMemoLoading) {
        return 'loading';
      }

      if (!userId || hasCurrentUserError) {
        return 'error';
      }

      resetMutationErrors();

      try {
        await deleteMemoMutation.mutateAsync({ userId, memoId: id });
        clearSelectedMemoIds([id]);
        return 'success';
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          deleteMemoMutation.reset();
          clearSelectedMemoIds([id]);
          return 'not-found';
        }

        return 'error';
      }
    },
    [
      clearSelectedMemoIds,
      deleteMemoMutation,
      hasCurrentUserError,
      isMemoLoading,
      resetMutationErrors,
      userId,
    ],
  );

  const deleteSelectedMemos = useCallback(async (): Promise<MemoMutationStatus> => {
    if (isMemoLoading) {
      return 'loading';
    }

    if (!userId || hasCurrentUserError) {
      return 'error';
    }

    const selectedMemoIds = memos
      .filter((memo) => memo.selected && !memo.deleted)
      .map((memo) => memo.id);

    if (selectedMemoIds.length === 0) {
      return 'success';
    }

    resetMutationErrors();

    try {
      await deleteSelectedMemosMutation.mutateAsync({
        userId,
        memoIds: selectedMemoIds,
      });
      clearSelectedMemoIds(selectedMemoIds);
      return 'success';
    } catch {
      clearSelectedMemoIds(selectedMemoIds);
      return 'error';
    }
  }, [
    clearSelectedMemoIds,
    deleteSelectedMemosMutation,
    hasCurrentUserError,
    isMemoLoading,
    memos,
    resetMutationErrors,
    userId,
  ]);

  const restoreMemo = useCallback(
    async (id: string): Promise<MemoMutationStatus> => {
      if (isMemoLoading) {
        return 'loading';
      }

      if (!userId || hasCurrentUserError) {
        return 'error';
      }

      resetMutationErrors();

      try {
        await restoreMemoMutation.mutateAsync({ userId, memoId: id });
        clearSelectedMemoIds([id]);
        return 'success';
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          restoreMemoMutation.reset();
          clearSelectedMemoIds([id]);
          return 'not-found';
        }

        return 'error';
      }
    },
    [
      clearSelectedMemoIds,
      hasCurrentUserError,
      isMemoLoading,
      resetMutationErrors,
      restoreMemoMutation,
      userId,
    ],
  );

  const permanentDeleteMemo = useCallback(
    async (id: string): Promise<MemoMutationStatus> => {
      if (isMemoLoading) {
        return 'loading';
      }

      if (!userId || hasCurrentUserError) {
        return 'error';
      }

      resetMutationErrors();

      try {
        await permanentDeleteMemoMutation.mutateAsync({ userId, memoId: id });
        clearSelectedMemoIds([id]);
        return 'success';
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          permanentDeleteMemoMutation.reset();
          clearSelectedMemoIds([id]);
          return 'not-found';
        }

        return 'error';
      }
    },
    [
      clearSelectedMemoIds,
      hasCurrentUserError,
      isMemoLoading,
      permanentDeleteMemoMutation,
      resetMutationErrors,
      userId,
    ],
  );

  const authErrorMessage =
    !isCurrentUserPending && (hasCurrentUserError || !userId)
      ? getMemoErrorMessage(currentUserError, '로그인 정보를 확인할 수 없습니다.')
      : null;
  const queryErrorMessage = memoQuery.error
    ? getMemoErrorMessage(memoQuery.error, '메모를 불러오지 못했습니다.')
    : null;
  const errorMessage =
    authErrorMessage ??
    queryErrorMessage ??
    getMutationErrorMessage(
      saveMemoMutation.error,
      saveMemoMutation.variables?.userId,
      userId,
      '메모를 저장하지 못했습니다.',
    ) ??
    getMutationErrorMessage(
      toggleMemoPinMutation.error,
      toggleMemoPinMutation.variables?.userId,
      userId,
      '메모 고정 상태를 변경하지 못했습니다.',
    ) ??
    getMutationErrorMessage(
      deleteMemoMutation.error,
      deleteMemoMutation.variables?.userId,
      userId,
      '메모를 삭제하지 못했습니다.',
    ) ??
    getMutationErrorMessage(
      deleteSelectedMemosMutation.error,
      deleteSelectedMemosMutation.variables?.userId,
      userId,
      '일부 메모를 삭제하지 못했습니다.',
    ) ??
    getMutationErrorMessage(
      restoreMemoMutation.error,
      restoreMemoMutation.variables?.userId,
      userId,
      '메모를 복구하지 못했습니다.',
    ) ??
    getMutationErrorMessage(
      permanentDeleteMemoMutation.error,
      permanentDeleteMemoMutation.variables?.userId,
      userId,
      '메모를 영구 삭제하지 못했습니다.',
    );

  const value = useMemo(
    () => ({
      memos,
      widgetMemos,
      isLoading: isMemoLoading,
      errorMessage,
      saveMemo,
      toggleSelectMemo,
      selectMemos,
      togglePinMemo,
      deleteMemo,
      deleteSelectedMemos,
      restoreMemo,
      permanentDeleteMemo,
    }),
    [
      memos,
      widgetMemos,
      isMemoLoading,
      errorMessage,
      saveMemo,
      toggleSelectMemo,
      selectMemos,
      togglePinMemo,
      deleteMemo,
      deleteSelectedMemos,
      restoreMemo,
      permanentDeleteMemo,
    ],
  );

  return <MemoStoreContext.Provider value={value}>{children}</MemoStoreContext.Provider>;
}

export function useMemoStore() {
  const context = useContext(MemoStoreContext);

  if (!context) {
    throw new Error('useMemoStore must be used within MemoStoreProvider');
  }

  return context;
}
