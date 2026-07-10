import Link from 'next/link';

import { CalendarIcon } from '@/assets/icons/sidebar';

import DashboardSectionHeader from './DashboardSectionHeader';

export default function DashboardUpcomingEvents() {
  return (
    <section className="mb-10">
      <DashboardSectionHeader icon={<CalendarIcon />} title="다가오는 일정" />

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
    </section>
  );
}
