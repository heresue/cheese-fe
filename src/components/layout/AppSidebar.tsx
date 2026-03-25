'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

function SidebarIcon({ type, active }: { type: NavigationItem['icon']; active: boolean }) {
  const stroke = active ? 'var(--color-secondary-700)' : 'var(--color-gray-600)';
  const strokeWidth = 1.8;

  switch (type) {
    case 'bell':
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M9 15.5C9.82843 15.5 10.5 14.8284 10.5 14H7.5C7.5 14.8284 8.17157 15.5 9 15.5Z"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 6.5C13 4.29086 11.2091 2.5 9 2.5C6.79086 2.5 5 4.29086 5 6.5V8.16667C5 9.26673 4.63095 10.335 3.95137 11.2L3 12.4167H15L14.0486 11.2C13.369 10.335 13 9.26673 13 8.16667V6.5Z"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'calendar':
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <rect
            x="2.5"
            y="3.5"
            width="13"
            height="12"
            rx="2.2"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <path
            d="M5.5 2.5V5.5M12.5 2.5V5.5M2.5 7H15.5"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>
      );

    case 'memo':
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M4 3.5H14C14.5523 3.5 15 3.94772 15 4.5V13.5C15 14.0523 14.5523 14.5 14 14.5H4C3.44772 14.5 3 14.0523 3 13.5V4.5C3 3.94772 3.44772 3.5 4 3.5Z"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <path
            d="M6 7H12M6 10H11"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>
      );

    case 'pencil':
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M3 12.75V15H5.25L13.845 6.405C14.2355 6.01448 14.2355 5.38131 13.845 4.99079L13.0092 4.15497C12.6187 3.76445 11.9855 3.76445 11.595 4.15497L3 12.75Z"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <path
            d="M10.5 5.25L12.75 7.5"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>
      );

    case 'community':
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M4 4.5H14C14.5523 4.5 15 4.94772 15 5.5V11.5C15 12.0523 14.5523 12.5 14 12.5H8L5 14.75V12.5H4C3.44772 12.5 3 12.0523 3 11.5V5.5C3 4.94772 3.44772 4.5 4 4.5Z"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <path
            d="M6 8H12M6 10H10"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>
      );

    default:
      return null;
  }
}

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-dvh w-[254px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="px-4 pt-8 pb-14">
        <Link href="/calendar" aria-label="Cheese 홈" className="inline-flex">
          <Image src="/brands/cheese-logo.svg" alt="CHEESE" width={137} height={38} priority />
        </Link>
      </div>

      <div className="px-4">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-tag-blue-100)] text-[11px] font-semibold text-[var(--color-tag-blue-500)]">
            김
            <span className="absolute -top-[1px] -right-[1px] h-[9px] w-[9px] rounded-full border border-[var(--color-bg)] bg-[var(--color-tag-yellow-500)]" />
          </div>
          <span className="text-sm font-semibold text-[var(--color-gray-800)]">김치즈님</span>
        </div>
      </div>

      <nav className="mt-5 px-[10px]">
        <ul className="flex flex-col gap-1">
          {navigationItems.map((item) => {
            const active = pathname === item.href;

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={[
                    'flex h-9 items-center gap-3 rounded-[10px] px-3 text-sm font-medium transition',
                    active
                      ? 'bg-[var(--color-primary-300)] text-[var(--color-gray-900)]'
                      : 'text-[var(--color-gray-700)] hover:bg-[var(--color-primary-100)]',
                  ].join(' ')}
                >
                  <span className="flex h-[18px] w-[18px] items-center justify-center">
                    <SidebarIcon type={item.icon} active={active} />
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
