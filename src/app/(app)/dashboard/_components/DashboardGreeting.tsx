import Image from 'next/image';
import Link from 'next/link';

import { getMockPersonalProfile } from '@/mocks/profile/userProfiles';

export default function DashboardGreetingSection() {
  const profile = getMockPersonalProfile(1);

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
          반갑습니다 {profile.nickname}님
        </h1>
      </div>

      <p className="text-dashboard-gray text-[14px] leading-[22px] font-medium">
        <Link href="/calendar" className="hover:text-dashboard-navy hover:underline">
          일정을 확인하고 이번 주를 준비해 보세요
        </Link>
      </p>
    </section>
  );
}
