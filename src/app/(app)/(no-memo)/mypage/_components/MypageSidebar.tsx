'use client';

import Link from 'next/link';
import MypageIcon from '@/assets/icons/mypage.svg';
import BookmarksIcon from '@/assets/icons/like.svg';
import ApplicationsIcon from '@/assets/icons/applications.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const MYPAGE_MENU_ITEMS = [
  { label: '마이페이지', href: '/mypage', icon: <MypageIcon /> },
  { label: '내 관심글', href: '/mypage/bookmarks', icon: <BookmarksIcon /> },
  { label: '지원현황', href: '/mypage/applications', icon: <ApplicationsIcon /> },
  { label: '설정', href: '/mypage/settings', icon: <SettingsIcon /> },
];

export default function MyPageSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-background-3 h-full">
      <nav className="px-4 pt-[90px]">
        <ul className="flex flex-col gap-2">
          {MYPAGE_MENU_ITEMS.map((item) => {
            const isActive = pathname == item.href;
            return (
              <li
                key={item.href}
                className={clsx(
                  'text-sidebar-text hover:bg-sidebar-bg-hover flex items-center rounded-[10px] font-medium',
                  isActive ? 'bg-sidebar-bg-active text-sidebar-text-active' : '',
                )}
              >
                <Link href={item.href} className="w-full py-3">
                  <div className={clsx('inline-flex w-full items-center gap-2 pl-2')}>
                    <span
                      className={clsx(
                        'inline-flex h-4 w-4 items-center justify-center',
                        isActive ? 'text-sidebar-icon-active' : '',
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
