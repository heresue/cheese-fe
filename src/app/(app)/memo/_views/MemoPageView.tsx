'use client';

import { useMemo, useState } from 'react';

import { MemoCard } from '../_components/MemoCard';
import { MemoEditorModal } from '../_components/MemoEditorModal';
import { MemoToolbar } from '../_components/MemoToolbar';
import { mockMemos } from '../_data/mockMemos';
import type { Memo } from '../_types/memo';

type MemoFilter = 'all' | 'pinned' | 'deleted';

function getTodayText() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const date = `${now.getDate()}`.padStart(2, '0');

  return `${year}. ${month}. ${date}`;
}

export function MemoPageView() {
  const [memos, setMemos] = useState<Memo[]>(mockMemos);
  const [filter, setFilter] = useState<MemoFilter>('all');
  const [searchValue, setSearchValue] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);

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

        return (
          memo.title.toLowerCase().includes(normalizedSearchValue) ||
          memo.content.toLowerCase().includes(normalizedSearchValue)
        );
      });
  }, [filter, memos, searchValue]);

  const handleChangeFilter = (nextFilter: MemoFilter) => {
    setFilter(nextFilter);
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
  };

  const handleRestore = (id: string) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === id
          ? {
              ...memo,
              deleted: false,
            }
          : memo,
      ),
    );
  };

  const handlePermanentDelete = (id: string) => {
    setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== id));
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
  };

  return (
    <main className="min-h-dvh overflow-y-auto bg-white px-[56px] pt-[40px] pb-[80px]">
      <MemoToolbar
        filter={filter}
        searchValue={searchValue}
        selectedCount={selectedCount}
        onChangeFilter={handleChangeFilter}
        onChangeSearchValue={setSearchValue}
        onToggleSelectMode={handleToggleSelectMode}
        onDeleteSelected={handleDeleteSelected}
        onCreate={handleOpenCreateEditor}
      />

      <section className="mx-auto grid max-w-[1320px] grid-cols-[repeat(5,250px)] gap-x-[34px] gap-y-[20px]">
        {filteredMemos.map((memo) => (
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

      <MemoEditorModal
        open={isEditorOpen}
        memo={editingMemo}
        onClose={() => setIsEditorOpen(false)}
        onSubmit={handleSubmitMemo}
      />
    </main>
  );
}
