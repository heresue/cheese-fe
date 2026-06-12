'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { MemoCard } from '../_components/MemoCard';
import { MemoEditorModal } from '../_components/MemoEditorModal';
import { MemoToolbar } from '../_components/MemoToolbar';
import { mockMemos } from '../_data/mockMemos';
import { stripHtml } from '../_lib/memoText';
import type { Memo } from '../_types/memo';

type MemoFilter = 'all' | 'pinned' | 'deleted';
type MemoSortOrder = 'latest' | 'oldest';

const PAGE_SIZE = 15;

function getTodayText() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const date = `${now.getDate()}`.padStart(2, '0');

  return `${year}. ${month}. ${date}`;
}

function parseMemoDateValue(dateText: string) {
  const [year, month, date] = dateText.match(/\d+/g)?.map(Number) ?? [];

  if (!year || !month || !date) {
    return 0;
  }

  return new Date(year, month - 1, date).getTime();
}

export function MemoPageView() {
  const [memos, setMemos] = useState<Memo[]>(mockMemos);
  const [filter, setFilter] = useState<MemoFilter>('all');
  const [sortOrder, setSortOrder] = useState<MemoSortOrder>('latest');
  const [searchValue, setSearchValue] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const selectedCount = memos.filter((memo) => memo.selected && !memo.deleted).length;

  const filteredMemos = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    return memos
      .filter((memo) => {
        if (filter === 'deleted') return memo.deleted;
        if (filter === 'pinned') return memo.pinned && !memo.deleted;

        return !memo.deleted;
      })
      .filter((memo) => {
        if (!normalizedSearchValue) return true;

        const plainContent = stripHtml(memo.content).toLowerCase();

        return (
          memo.title.toLowerCase().includes(normalizedSearchValue) ||
          plainContent.includes(normalizedSearchValue)
        );
      })
      .map((memo, index) => ({
        memo,
        index,
      }))
      .sort((a, b) => {
        const dateA = parseMemoDateValue(a.memo.createdAt);
        const dateB = parseMemoDateValue(b.memo.createdAt);
        const dateDiff = sortOrder === 'latest' ? dateB - dateA : dateA - dateB;

        if (dateDiff !== 0) return dateDiff;

        return a.index - b.index;
      })
      .map(({ memo }) => memo);
  }, [filter, memos, searchValue, sortOrder]);

  const visibleMemos = filteredMemos.slice(0, visibleCount);
  const hasMoreMemos = visibleCount < filteredMemos.length;

  const resetVisibleMemos = () => {
    setVisibleCount(PAGE_SIZE);

    requestAnimationFrame(() => {
      scrollAreaRef.current?.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    });
  };

  const handleChangeFilter = (nextFilter: MemoFilter) => {
    setFilter(nextFilter);
    resetVisibleMemos();
  };

  const handleChangeSortOrder = (nextSortOrder: MemoSortOrder) => {
    setSortOrder(nextSortOrder);
    resetVisibleMemos();
  };

  const handleChangeSearchValue = (value: string) => {
    setSearchValue(value);
    resetVisibleMemos();
  };

  const handleToggleSelectMode = () => {
    setMemos((prevMemos) => {
      const visibleIds = new Set(filteredMemos.map((memo) => memo.id));
      const hasUnselectedVisibleMemo = prevMemos.some(
        (memo) => visibleIds.has(memo.id) && !memo.selected,
      );

      return prevMemos.map((memo) => {
        if (!visibleIds.has(memo.id)) return memo;

        return {
          ...memo,
          selected: hasUnselectedVisibleMemo,
        };
      });
    });
  };

  const handleToggleSelect = (id: string) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === id
          ? {
              ...memo,
              selected: !memo.selected,
            }
          : memo,
      ),
    );
  };

  const handleTogglePin = (id: string) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === id
          ? {
              ...memo,
              pinned: !memo.pinned,
            }
          : memo,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === id
          ? {
              ...memo,
              selected: false,
              deleted: true,
            }
          : memo,
      ),
    );

    resetVisibleMemos();
  };

  const handleDeleteSelected = () => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.selected && !memo.deleted
          ? {
              ...memo,
              selected: false,
              deleted: true,
            }
          : memo,
      ),
    );

    resetVisibleMemos();
  };

  const handleRestore = (id: string) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === id
          ? {
              ...memo,
              deleted: false,
              selected: false,
            }
          : memo,
      ),
    );

    resetVisibleMemos();
  };

  const handlePermanentDelete = (id: string) => {
    setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== id));
    resetVisibleMemos();
  };

  const handleOpenCreateEditor = () => {
    setEditingMemo(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditEditor = (memo: Memo) => {
    setEditingMemo(memo);
    setIsEditorOpen(true);
  };

  const handleSubmitMemo = (
    nextMemo: Omit<Memo, 'id' | 'createdAt'> & Partial<Pick<Memo, 'id' | 'createdAt'>>,
  ) => {
    if (nextMemo.id) {
      setMemos((prevMemos) =>
        prevMemos.map((memo) =>
          memo.id === nextMemo.id
            ? {
                ...memo,
                ...nextMemo,
              }
            : memo,
        ),
      );

      resetVisibleMemos();
      return;
    }

    setMemos((prevMemos) => [
      {
        id: `memo-${Date.now()}`,
        title: nextMemo.title,
        content: nextMemo.content,
        createdAt: getTodayText(),
        color: nextMemo.color,
        pinned: nextMemo.pinned,
        imageSrc: nextMemo.imageSrc,
        selected: false,
        deleted: false,
      },
      ...prevMemos,
    ]);

    resetVisibleMemos();
  };

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const target = loadMoreRef.current;

    if (!scrollArea || !target || !hasMoreMemos) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setVisibleCount((prevVisibleCount) =>
          Math.min(prevVisibleCount + PAGE_SIZE, filteredMemos.length),
        );
      },
      {
        root: scrollArea,
        rootMargin: '360px 0px',
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [filteredMemos.length, hasMoreMemos]);

  return (
    <main className="flex h-dvh min-h-0 min-w-0 flex-col overflow-hidden bg-white">
      <div className="shrink-0 px-[56px] pt-[40px]">
        <MemoToolbar
          filter={filter}
          sortOrder={sortOrder}
          searchValue={searchValue}
          selectedCount={selectedCount}
          onChangeFilter={handleChangeFilter}
          onChangeSortOrder={handleChangeSortOrder}
          onChangeSearchValue={handleChangeSearchValue}
          onToggleSelectMode={handleToggleSelectMode}
          onDeleteSelected={handleDeleteSelected}
          onCreate={handleOpenCreateEditor}
        />
      </div>

      <div
        ref={scrollAreaRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[56px] pb-[80px]"
      >
        {filteredMemos.length === 0 ? (
          <section className="mx-auto flex h-[320px] max-w-[1320px] items-center justify-center rounded-[10px] border border-gray-300 bg-white">
            <p className="text-[15px] font-medium text-gray-500">조건에 맞는 메모가 없습니다.</p>
          </section>
        ) : (
          <>
            <section className="mx-auto grid max-w-[1320px] grid-cols-[repeat(5,250px)] gap-x-[34px] gap-y-[20px]">
              {visibleMemos.map((memo) => (
                <MemoCard
                  key={memo.id}
                  memo={memo}
                  onToggleSelect={handleToggleSelect}
                  onTogglePin={handleTogglePin}
                  onDelete={handleDelete}
                  onRestore={handleRestore}
                  onPermanentDelete={handlePermanentDelete}
                  onEdit={handleOpenEditEditor}
                />
              ))}
            </section>

            <div
              ref={loadMoreRef}
              className="mx-auto flex h-[96px] max-w-[1320px] items-center justify-center"
            >
              {hasMoreMemos ? (
                <span className="text-[13px] font-medium text-gray-500">더 불러오는 중...</span>
              ) : null}
            </div>
          </>
        )}
      </div>

      <MemoEditorModal
        open={isEditorOpen}
        memo={editingMemo}
        onClose={() => setIsEditorOpen(false)}
        onSubmit={handleSubmitMemo}
      />
    </main>
  );
}
