'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  AlarmIcon,
  CalendarIcon,
  CommunityIcon,
  MemoIcon,
  ProblemSolvingIcon,
} from '@/assets/icons/sidebar';
import { MiniCalendar } from '@/features/calendar/ui/sidebar/MiniCalendar';

type NavigationItem = {
  label: string;
  href: string;
  icon: 'bell' | 'calendar' | 'memo' | 'pencil' | 'community';
};

const navigationItems: NavigationItem[] = [
  { label: '알림', href: '/notifications', icon: 'bell' },
  { label: '일정 관리', href: '/calendar', icon: 'calendar' },
  { label: '메모', href: '/memo', icon: 'memo' },
  { label: '문제 풀이', href: '/problems', icon: 'pencil' },
  { label: '커뮤니티', href: '/community', icon: 'community' },
];

function SidebarIcon({ type }: { type: NavigationItem['icon'] }) {
  switch (type) {
    case 'bell':
      return <AlarmIcon width={16} height={20} aria-hidden="true" className="shrink-0" />;
    case 'calendar':
      return <CalendarIcon width={16} height={18} aria-hidden="true" className="shrink-0" />;
    case 'memo':
      return <MemoIcon width={16} height={16} aria-hidden="true" className="shrink-0" />;
    case 'pencil':
      return <ProblemSolvingIcon width={16} height={18} aria-hidden="true" className="shrink-0" />;
    case 'community':
      return <CommunityIcon width={16} height={15} aria-hidden="true" className="shrink-0" />;
    default:
      return null;
  }
}

function isItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border bg-bg-1 flex h-dvh w-[254px] shrink-0 flex-col border-r">
      <div className="px-4 pt-8 pb-14">
        <Link href="/calendar" aria-label="Cheese 홈" className="inline-flex">
          <Image src="/brands/cheese-logo.svg" alt="CHEESE" width={137} height={38} priority />
        </Link>
      </div>

      <div className="px-4">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="bg-tag-blue-100 text-tag-blue-500 relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
            김
            <span className="border-bg-1 bg-secondary-500 absolute -top-[1px] -right-[1px] h-[9px] w-[9px] rounded-full border" />
          </div>
          <span className="text-sm font-semibold text-gray-800">김치즈님</span>
        </div>
      </div>

      <nav className="mt-5 px-[10px]">
        <ul className="flex flex-col gap-1">
          {navigationItems.map((item) => {
            const isActive = isItemActive(pathname, item.href);

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group flex h-9 items-center gap-3 rounded-[10px] px-3 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-300 text-gray-900'
                      : 'hover:bg-primary-300 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <span
                    className={`flex h-[18px] w-[18px] items-center justify-center transition-colors duration-200 ${
                      isActive
                        ? 'text-secondary-700'
                        : 'group-hover:text-secondary-700 text-gray-600'
                    }`}
                  >
                    <SidebarIcon type={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-9 px-5">
        <MiniCalendar />
      </div>
    </aside>
  );
}
