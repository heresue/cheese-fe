'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { MYPAGE_MENU_ITEMS } from '@/constants/mypageMenu';

import MypageIcon from '@/assets/icons/settings/user.svg';
import BookmarksIcon from '@/assets/icons/like-outline.svg';
import ApplicationsIcon from '@/assets/icons/settings/applications.svg';
import SettingsIcon from '@/assets/icons/settings/settings.svg';

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
