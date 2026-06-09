'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MYPAGE_MENU_ITEMS } from '../../_constants/mypageMenu';

import { cn } from '@/lib/cn';

import { UserIcon as MypageIcon, ApplicationsIcon, SettingsIcon } from '@/assets/icons/settings';
import BookmarksIcon from '@/assets/icons/common/like-outline.svg';

const ICON_MAP = {
  mypage: <MypageIcon />,
  bookmarks: <BookmarksIcon />,
  applications: <ApplicationsIcon />,
  settings: <SettingsIcon />,
};

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
                className={cn(
                  'text-sidebar-text hover:bg-sidebar-bg-hover flex items-center rounded-[10px] font-medium',
                  isActive ? 'bg-sidebar-bg-active text-sidebar-text-active' : '',
                )}
              >
                <Link href={item.href} className="w-full py-3">
                  <div className={cn('inline-flex w-full items-center gap-2 pl-2')}>
                    <span
                      className={cn(
                        'inline-flex h-4 w-4 items-center justify-center',
                        isActive ? 'text-sidebar-icon-active' : '',
                      )}
                    >
                      {ICON_MAP[item.icon]}
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
