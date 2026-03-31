'use client';

import Link from 'next/link';

const MYPAGE_MENU_ITEMS = [
  { label: '마이페이지', href: '/mypage' },
  { label: '내 관심글', href: '/mypage/bookmarks' },
  { label: '지원현황', href: '/mypage/applications' },
  { label: '설정', href: '/mypage/settings' },
];

export default function MyPageSidebar() {
  return (
    <div className="bg-background-3 h-full">
      <nav>
        <ul>
          {MYPAGE_MENU_ITEMS.map((item) => {
            return (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
