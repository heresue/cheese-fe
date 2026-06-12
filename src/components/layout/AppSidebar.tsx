'use client';

import { useState } from 'react';

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
import { MiniCalendar } from '@/app/(app)/calendar/_ui/sidebar/MiniCalendar';

import { NotificationSidebar } from './NotificationSidebar';

type NavigationIconType = 'bell' | 'calendar' | 'memo' | 'pencil' | 'community';

type LinkNavigationItem = {
  type: 'link';
  label: string;
  href: string;
  icon: NavigationIconType;
};

type ActionNavigationItem = {
  type: 'action';
  label: string;
  action: 'notification';
  icon: NavigationIconType;
};

type NavigationItem = LinkNavigationItem | ActionNavigationItem;

const DEFAULT_PROFILE_IMAGE_SRC = '/profile_default.png';

const navigationItems: NavigationItem[] = [
  { type: 'action', label: '알림', action: 'notification', icon: 'bell' },
  { type: 'link', label: '일정 관리', href: '/calendar', icon: 'calendar' },
  { type: 'link', label: '메모', href: '/memo', icon: 'memo' },
  { type: 'link', label: '문제 풀이', href: '/problem', icon: 'pencil' },
  { type: 'link', label: '커뮤니티', href: '/community', icon: 'community' },
];

function SidebarIcon({ type }: { type: NavigationIconType }) {
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

function getNavigationItemClassName(isActive: boolean) {
  return `group flex h-9 w-full items-center gap-3 rounded-[10px] px-3 text-sm font-medium transition-colors duration-200 ${
    isActive
      ? 'bg-primary-300 text-gray-900'
      : 'text-gray-700 hover:bg-primary-300 hover:text-gray-900'
  }`;
}

function getNavigationIconClassName(isActive: boolean) {
  return `flex h-[18px] w-[18px] items-center justify-center transition-colors duration-200 ${
    isActive ? 'text-secondary-700' : 'text-gray-600 group-hover:text-secondary-700'
  }`;
}

export default function AppSidebar() {
  const pathname = usePathname();
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);

  return (
    <>
      <aside className="border-border bg-primary-100 z-50 flex h-dvh w-[254px] shrink-0 flex-col border-r">
        <div className="px-4 pt-8 pb-14">
          <Link
            href="/calendar"
            aria-label="Cheese 홈"
            className="inline-flex"
            onClick={() => setIsNotificationSidebarOpen(false)}
          >
            <Image src="/brands/cheese-logo.svg" alt="CHEESE" width={137} height={38} priority />
          </Link>
        </div>

        <div className="px-4">
          <Link
            href="/mypage"
            aria-label="마이페이지로 이동"
            className="inline-flex items-center gap-3 px-2 py-1"
            onClick={() => setIsNotificationSidebarOpen(false)}
          >
            <Image
              src={DEFAULT_PROFILE_IMAGE_SRC}
              alt="기본 프로필 이미지"
              width={30}
              height={30}
              className="h-[30px] w-[30px] shrink-0 rounded-full object-cover"
            />

            <span className="text-sm font-semibold text-gray-800">김치즈 님</span>
          </Link>
        </div>

        <nav className="mt-5 px-[10px]">
          <ul className="flex flex-col gap-1">
            {navigationItems.map((item) => {
              if (item.type === 'action') {
                const isActive = isNotificationSidebarOpen;

                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-pressed={isNotificationSidebarOpen}
                      onClick={() => setIsNotificationSidebarOpen((prev) => !prev)}
                      className={getNavigationItemClassName(isActive)}
                    >
                      <span className={getNavigationIconClassName(isActive)}>
                        <SidebarIcon type={item.icon} />
                      </span>

                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              }

              const isActive = !isNotificationSidebarOpen && isItemActive(pathname, item.href);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setIsNotificationSidebarOpen(false)}
                    className={getNavigationItemClassName(isActive)}
                  >
                    <span className={getNavigationIconClassName(isActive)}>
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

      {isNotificationSidebarOpen ? (
        <div className="fixed top-0 left-[254px] z-40 h-dvh">
          <NotificationSidebar onClose={() => setIsNotificationSidebarOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
