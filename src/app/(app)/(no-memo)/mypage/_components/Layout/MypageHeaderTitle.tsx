'use client';

import { MYPAGE_MENU_ITEMS } from '../../_constants/mypageMenu';
import { usePathname } from 'next/navigation';

export default function MypageHeaderTitle() {
  const pathname = usePathname();

  const currentMenu = MYPAGE_MENU_ITEMS.find((menu) => menu.href === pathname);

  return <h1 className="text-[24px] font-medium">{currentMenu?.label ?? ''}</h1>;
}
