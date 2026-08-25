'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { AuthUser } from '@/api/auth.api';
import { ApiError } from '@/api/client';
import { uploadFile } from '@/api/files.api';
import {
  createMemo as createMemoRequest,
  deleteMemo as deleteMemoRequest,
  getMemos,
  getWidgetMemos,
  permanentDeleteMemo as permanentDeleteMemoRequest,
  restoreMemo as restoreMemoRequest,
  updateMemo as updateMemoRequest,
  updateMemoPin,
  type MemoDraft,
} from '@/api/memo.api';
import { authQueryKeys } from '@/queries/auth/authQueryKeys';
import { useCurrentUser } from '@/queries/auth/useCurrentUser';

import { stripHtml } from '../_lib/memoText';
import type { Memo } from '../_types/memo';

const WIDGET_MEMO_LIMIT = 5;

export type MemoSavePayload = Omit<
  Memo,
  'id' | 'createdAt' | 'updatedAt' | 'contentText' | 'deletedAt'
> &
  Partial<Pick<Memo, 'id' | 'createdAt'>> & {
    imageFile?: File;
    imageFileId?: string | null;
  };

type MemoMutationStatus = 'success' | 'not-found' | 'loading' | 'cancelled' | 'error';

type MemoState = {
  ownerUserId: string | null;
  memos: Memo[];
  widgetMemos: Memo[];
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

function getMemoErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function sortWidgetMemos(memos: Memo[]) {
  return memos
    .filter((memo) => !memo.deleted)
    .sort((left, right) => {
      if (Boolean(left.pinned) !== Boolean(right.pinned)) {
        return Number(Boolean(right.pinned)) - Number(Boolean(left.pinned));
      }

      return (right.updatedAt ?? right.createdAt).localeCompare(left.updatedAt ?? left.createdAt);
    })
    .slice(0, WIDGET_MEMO_LIMIT);
}

function replaceMemo(memos: Memo[], nextMemo: Memo) {
  const currentMemo = memos.find((memo) => memo.id === nextMemo.id);

  if (!currentMemo) {
    return [nextMemo, ...memos];
  }

  return memos.map((memo) =>
    memo.id === nextMemo.id
      ? {
          ...nextMemo,
          selected: currentMemo.selected,
        }
      : memo,
  );
}

function updateOwnedMemoState(
  state: MemoState,
  ownerUserId: string,
  updateState: (state: MemoState) => MemoState,
) {
  if (state.ownerUserId !== ownerUserId) {
    return state;
  }

  return updateState(state);
}

function syncMemo(state: MemoState, nextMemo: Memo): MemoState {
  const memos = replaceMemo(state.memos, nextMemo);

  return {
    ...state,
    memos,
    widgetMemos: sortWidgetMemos(replaceMemo(state.widgetMemos, nextMemo)),
  };
}

function removeMemo(state: MemoState, memoId: string): MemoState {
  return {
    ...state,
    memos: state.memos.filter((memo) => memo.id !== memoId),
    widgetMemos: state.widgetMemos.filter((memo) => memo.id !== memoId),
  };
}

export function MemoStoreProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const {
    data: currentUser,
    error: currentUserError,
    isPending: isCurrentUserPending,
    isRefetchError: isCurrentUserRefetchError,
  } = useCurrentUser();
  const userId = currentUser?.id;
  const [memoState, setMemoState] = useState<MemoState>({
    ownerUserId: null,
    memos: [],
    widgetMemos: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasCurrentUserError = Boolean(currentUserError) || isCurrentUserRefetchError;
  const hasCurrentUserMemos =
    !isCurrentUserPending &&
    !hasCurrentUserError &&
    Boolean(userId) &&
    memoState.ownerUserId === userId;
  const memos = hasCurrentUserMemos ? memoState.memos : EMPTY_MEMOS;
  const widgetMemos = hasCurrentUserMemos ? memoState.widgetMemos : EMPTY_MEMOS;
  const isMemoOwnerChanging =
    Boolean(userId) && !hasCurrentUserError && memoState.ownerUserId !== userId;
  const isMemoLoading = isLoading || isCurrentUserPending || isMemoOwnerChanging;
  const isCurrentAuthUser = useCallback(
    (requestUserId: string) => {
      const authQueryState = queryClient.getQueryState<AuthUser>(authQueryKeys.me());

      return (
        authQueryState?.status === 'success' &&
        authQueryState.error === null &&
        authQueryState.data?.id === requestUserId
      );
    },
    [queryClient],
  );

  useEffect(() => {
    if (isCurrentUserPending) {
      setIsLoading(true);
      return;
    }

    if (hasCurrentUserError || !userId) {
      setMemoState({ ownerUserId: null, memos: [], widgetMemos: [] });
      setIsLoading(false);
      setErrorMessage(getMemoErrorMessage(currentUserError, '로그인 정보를 확인할 수 없습니다.'));
      return;
    }

    const controller = new AbortController();
    let isCancelled = false;

    setMemoState({ ownerUserId: userId, memos: [], widgetMemos: [] });

    const loadMemos = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [activeMemos, deletedMemos, nextWidgetMemos] = await Promise.all([
          getMemos({ userId, signal: controller.signal }),
          getMemos({ userId, deleted: true, signal: controller.signal }),
          getWidgetMemos({ userId, limit: WIDGET_MEMO_LIMIT, signal: controller.signal }),
        ]);

        if (isCancelled || !isCurrentAuthUser(userId)) {
          return;
        }

        setMemoState({
          ownerUserId: userId,
          memos: [...activeMemos, ...deletedMemos],
          widgetMemos: nextWidgetMemos,
        });
      } catch (error) {
        if (isCancelled || !isCurrentAuthUser(userId)) {
          return;
        }

        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setErrorMessage(getMemoErrorMessage(error, '메모를 불러오지 못했습니다.'));
      } finally {
        if (!isCancelled && isCurrentAuthUser(userId)) {
          setIsLoading(false);
        }
      }
    };

    void loadMemos();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [currentUserError, hasCurrentUserError, isCurrentAuthUser, isCurrentUserPending, userId]);

  const saveMemo = useCallback(
    async (nextMemo: MemoSavePayload): Promise<MemoMutationStatus> => {
      if (isMemoLoading) {
        return 'loading';
      }

      if (!userId || !isCurrentAuthUser(userId)) {
        setErrorMessage('로그인 정보를 확인할 수 없습니다.');
        return 'error';
      }

      const requestUserId = userId;
      const currentMemo = nextMemo.id ? memos.find((memo) => memo.id === nextMemo.id) : undefined;

      if (nextMemo.id && !currentMemo) {
        return 'not-found';
      }

      try {
        setErrorMessage(null);

        const uploadedFile = nextMemo.imageFile
          ? await uploadFile({ userId: requestUserId, file: nextMemo.imageFile })
          : null;

        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        const draft: MemoDraft = {
          title: nextMemo.title.trim() || '제목',
          contentHtml: nextMemo.content,
          contentText: stripHtml(nextMemo.content),
          color: nextMemo.color ?? 'gray',
          pinned: Boolean(nextMemo.pinned),
          imageFileId: uploadedFile?.id ?? nextMemo.imageFileId ?? currentMemo?.imageFileId,
        };

        let savedMemo: Memo;

        if (currentMemo) {
          savedMemo = await updateMemoRequest({
            userId: requestUserId,
            memoId: currentMemo.id,
            draft: {
              title: draft.title,
              contentHtml: draft.contentHtml,
              contentText: draft.contentText,
              color: draft.color,
              imageFileId: draft.imageFileId,
            },
          });

          if (Boolean(currentMemo.pinned) !== Boolean(draft.pinned)) {
            savedMemo = await updateMemoPin({
              userId: requestUserId,
              memoId: currentMemo.id,
              pinned: Boolean(draft.pinned),
            });
          }
        } else {
          savedMemo = await createMemoRequest({ userId: requestUserId, draft });
        }

        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        setMemoState((state) =>
          updateOwnedMemoState(state, requestUserId, (ownedState) =>
            syncMemo(ownedState, savedMemo),
          ),
        );
        return 'success';
      } catch (error) {
        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        if (error instanceof ApiError && error.status === 404 && nextMemo.id) {
          setMemoState((state) =>
            updateOwnedMemoState(state, requestUserId, (ownedState) =>
              removeMemo(ownedState, nextMemo.id as string),
            ),
          );
          return 'not-found';
        }

        setErrorMessage(getMemoErrorMessage(error, '메모를 저장하지 못했습니다.'));
        return 'error';
      }
    },
    [isCurrentAuthUser, isMemoLoading, memos, userId],
  );

  const toggleSelectMemo = useCallback(
    (id: string) => {
      if (!userId) return;

      setMemoState((state) =>
        updateOwnedMemoState(state, userId, (ownedState) => ({
          ...ownedState,
          memos: ownedState.memos.map((memo) =>
            memo.id === id ? { ...memo, selected: !memo.selected } : memo,
          ),
        })),
      );
    },
    [userId],
  );

  const selectMemos = useCallback(
    (ids: string[], selected: boolean) => {
      if (!userId) return;

      const targetIds = new Set(ids);

      setMemoState((state) =>
        updateOwnedMemoState(state, userId, (ownedState) => ({
          ...ownedState,
          memos: ownedState.memos.map((memo) =>
            targetIds.has(memo.id) ? { ...memo, selected } : memo,
          ),
        })),
      );
    },
    [userId],
  );

  const togglePinMemo = useCallback(
    async (id: string): Promise<MemoMutationStatus> => {
      if (isMemoLoading) {
        return 'loading';
      }

      if (!userId || !isCurrentAuthUser(userId)) {
        setErrorMessage('로그인 정보를 확인할 수 없습니다.');
        return 'error';
      }

      const currentMemo = memos.find((memo) => memo.id === id);

      if (!currentMemo) {
        return 'not-found';
      }

      const requestUserId = userId;

      try {
        setErrorMessage(null);

        const updatedMemo = await updateMemoPin({
          userId: requestUserId,
          memoId: id,
          pinned: !currentMemo.pinned,
        });

        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        setMemoState((state) =>
          updateOwnedMemoState(state, requestUserId, (ownedState) =>
            syncMemo(ownedState, updatedMemo),
          ),
        );
        return 'success';
      } catch (error) {
        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        if (error instanceof ApiError && error.status === 404) {
          setMemoState((state) =>
            updateOwnedMemoState(state, requestUserId, (ownedState) => removeMemo(ownedState, id)),
          );
          return 'not-found';
        }

        setErrorMessage(getMemoErrorMessage(error, '메모 고정 상태를 변경하지 못했습니다.'));
        return 'error';
      }
    },
    [isCurrentAuthUser, isMemoLoading, memos, userId],
  );

  const deleteMemo = useCallback(
    async (id: string): Promise<MemoMutationStatus> => {
      if (isMemoLoading) {
        return 'loading';
      }

      if (!userId || !isCurrentAuthUser(userId)) {
        setErrorMessage('로그인 정보를 확인할 수 없습니다.');
        return 'error';
      }

      const requestUserId = userId;

      try {
        setErrorMessage(null);

        const deletedMemo = await deleteMemoRequest({ userId: requestUserId, memoId: id });

        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        setMemoState((state) =>
          updateOwnedMemoState(state, requestUserId, (ownedState) =>
            syncMemo(ownedState, { ...deletedMemo, selected: false }),
          ),
        );
        return 'success';
      } catch (error) {
        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        if (error instanceof ApiError && error.status === 404) {
          setMemoState((state) =>
            updateOwnedMemoState(state, requestUserId, (ownedState) => removeMemo(ownedState, id)),
          );
          return 'not-found';
        }

        setErrorMessage(getMemoErrorMessage(error, '메모를 삭제하지 못했습니다.'));
        return 'error';
      }
    },
    [isCurrentAuthUser, isMemoLoading, userId],
  );

  const deleteSelectedMemos = useCallback(async (): Promise<MemoMutationStatus> => {
    if (isMemoLoading) {
      return 'loading';
    }

    if (!userId || !isCurrentAuthUser(userId)) {
      setErrorMessage('로그인 정보를 확인할 수 없습니다.');
      return 'error';
    }

    const selectedIds = memos
      .filter((memo) => memo.selected && !memo.deleted)
      .map((memo) => memo.id);

    if (selectedIds.length === 0) {
      return 'success';
    }

    const requestUserId = userId;
    const results = await Promise.allSettled(
      selectedIds.map((memoId) => deleteMemoRequest({ userId: requestUserId, memoId })),
    );

    if (!isCurrentAuthUser(requestUserId)) {
      return 'cancelled';
    }

    const deletedMemos = results.flatMap((result) =>
      result.status === 'fulfilled' ? [{ ...result.value, selected: false }] : [],
    );

    setMemoState((state) =>
      updateOwnedMemoState(state, requestUserId, (ownedState) =>
        deletedMemos.reduce(syncMemo, ownedState),
      ),
    );

    const rejectedResult = results.find((result) => result.status === 'rejected');

    if (rejectedResult?.status === 'rejected') {
      setErrorMessage(
        getMemoErrorMessage(rejectedResult.reason, '일부 메모를 삭제하지 못했습니다.'),
      );
      return 'error';
    }

    setErrorMessage(null);
    return 'success';
  }, [isCurrentAuthUser, isMemoLoading, memos, userId]);

  const restoreMemo = useCallback(
    async (id: string): Promise<MemoMutationStatus> => {
      if (isMemoLoading) {
        return 'loading';
      }

      if (!userId || !isCurrentAuthUser(userId)) {
        setErrorMessage('로그인 정보를 확인할 수 없습니다.');
        return 'error';
      }

      const requestUserId = userId;

      try {
        setErrorMessage(null);

        const restoredMemo = await restoreMemoRequest({ userId: requestUserId, memoId: id });

        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        setMemoState((state) =>
          updateOwnedMemoState(state, requestUserId, (ownedState) =>
            syncMemo(ownedState, restoredMemo),
          ),
        );
        return 'success';
      } catch (error) {
        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        if (error instanceof ApiError && error.status === 404) {
          setMemoState((state) =>
            updateOwnedMemoState(state, requestUserId, (ownedState) => removeMemo(ownedState, id)),
          );
          return 'not-found';
        }

        setErrorMessage(getMemoErrorMessage(error, '메모를 복구하지 못했습니다.'));
        return 'error';
      }
    },
    [isCurrentAuthUser, isMemoLoading, userId],
  );

  const permanentDeleteMemo = useCallback(
    async (id: string): Promise<MemoMutationStatus> => {
      if (isMemoLoading) {
        return 'loading';
      }

      if (!userId || !isCurrentAuthUser(userId)) {
        setErrorMessage('로그인 정보를 확인할 수 없습니다.');
        return 'error';
      }

      const requestUserId = userId;

      try {
        setErrorMessage(null);
        await permanentDeleteMemoRequest({ userId: requestUserId, memoId: id });

        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        setMemoState((state) =>
          updateOwnedMemoState(state, requestUserId, (ownedState) => removeMemo(ownedState, id)),
        );
        return 'success';
      } catch (error) {
        if (!isCurrentAuthUser(requestUserId)) {
          return 'cancelled';
        }

        if (error instanceof ApiError && error.status === 404) {
          setMemoState((state) =>
            updateOwnedMemoState(state, requestUserId, (ownedState) => removeMemo(ownedState, id)),
          );
          return 'not-found';
        }

        setErrorMessage(getMemoErrorMessage(error, '메모를 영구 삭제하지 못했습니다.'));
        return 'error';
      }
    },
    [isCurrentAuthUser, isMemoLoading, userId],
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
