'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  getBusiestWeekdayLabel,
  getThisWeekRemainingEvents,
} from '@/app/(app)/calendar/_lib/dashboard-events';
import { useCalendarStore } from '@/app/(app)/calendar/_store/CalendarStoreProvider';
import { getMockPersonalProfile } from '@/mocks/profile/userProfiles';

export default function DashboardGreetingSection() {
  const profile = getMockPersonalProfile(1);
  const { events } = useCalendarStore();

  const remainingThisWeek = getThisWeekRemainingEvents(events).length;
  const busiestWeekday = getBusiestWeekdayLabel(events);

  return (
    <section className="mb-10 flex flex-col items-center text-center">
      <div className="mb-3 flex items-center gap-3">
        <Image
          src="/brands/cheese-symbol.svg"
          alt=""
          width={28}
          height={28}
          aria-hidden="true"
          className="shrink-0"
        />

        <h1 className="text-dashboard-black text-[22px] leading-[32px] font-bold">
          반갑습니다 {profile.nickname}님,{' '}
          <Link href="/calendar" className="text-dashboard-navy hover:underline">
            이번주 남은 일정이 {remainingThisWeek}개 있어요
          </Link>
        </h1>
      </div>

      <p className="text-dashboard-gray text-[14px] leading-[22px] font-medium">
        {busiestWeekday ? (
          <Link href="/calendar" className="hover:text-dashboard-navy hover:underline">
            이 주에 가장 많은 일정이 있는 날은 {busiestWeekday}이에요
          </Link>
        ) : (
          <Link href="/calendar" className="hover:text-dashboard-navy hover:underline">
            일정을 확인하고 이번 주를 준비해 보세요
          </Link>
        )}
      </p>
    </section>
  );
}
