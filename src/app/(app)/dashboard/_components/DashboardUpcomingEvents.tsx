'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { getUpcomingEvents } from '@/app/(app)/calendar/_lib/dashboard-events';
import { useCalendarStore } from '@/app/(app)/calendar/_store/CalendarStoreProvider';
import { CalendarIcon } from '@/assets/icons/sidebar';
import { cn } from '@/lib/cn';

import DashboardEventCard from './DashboardEventCard';
import DashboardSectionHeader from './DashboardSectionHeader';

const VISIBLE_COUNT = 3;

function CarouselNavButton({
  label,
  direction,
  onClick,
  className,
}: {
  label: string;
  direction: 'left' | 'right';
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'border-border text-dashboard-gray hover:border-secondary-600 hover:text-dashboard-black absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white opacity-0 shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
        className,
      )}
    >
      <span aria-hidden="true" className="text-[18px] leading-none">
        {direction === 'left' ? '‹' : '›'}
      </span>
    </button>
  );
}

export default function DashboardUpcomingEvents() {
  const { events } = useCalendarStore();
  const upcomingEvents = getUpcomingEvents(events);
  const [startIndex, setStartIndex] = useState(0);

  const maxStartIndex = Math.max(0, upcomingEvents.length - VISIBLE_COUNT);
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex < maxStartIndex;

  useEffect(() => {
    setStartIndex((prev) => Math.min(prev, maxStartIndex));
  }, [maxStartIndex]);

  return (
    <section className="mb-10">
      <DashboardSectionHeader icon={<CalendarIcon />} title="다가오는 일정" />

      {upcomingEvents.length > 0 ? (
        <div className="group relative w-full">
          <div className="grid grid-cols-3 gap-4 overflow-hidden">
            {upcomingEvents.slice(startIndex, startIndex + VISIBLE_COUNT).map((event) => (
              <DashboardEventCard key={event.id} event={event} />
            ))}
          </div>

          {canGoPrev ? (
            <CarouselNavButton
              label="이전 일정 보기"
              direction="left"
              onClick={() => setStartIndex((prev) => Math.max(0, prev - 1))}
              className="left-0"
            />
          ) : null}

          {canGoNext ? (
            <CarouselNavButton
              label="다음 일정 보기"
              direction="right"
              onClick={() => setStartIndex((prev) => Math.min(maxStartIndex, prev + 1))}
              className="right-0"
            />
          ) : null}
        </div>
      ) : (
        <div className="border-border flex min-h-[188px] flex-col items-center justify-center rounded-[10px] border bg-white p-8 text-center">
          <p className="text-dashboard-gray text-[14px] leading-[22px] font-medium">
            다가오는 일정이 없습니다.
          </p>

          <Link
            href="/calendar"
            className="text-dashboard-navy mt-3 text-[14px] leading-[22px] font-medium hover:underline"
          >
            일정 추가하러 가기
          </Link>
        </div>
      )}
    </section>
  );
}
