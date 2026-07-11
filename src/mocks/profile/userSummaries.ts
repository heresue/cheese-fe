import type { UserSummary } from '@/types/community';

export function getMockUserSummary(id: number, type: UserSummary['profileType']) {
  const user = mockUserSummaries.find((user) => user.id === id && user.profileType === type);

  if (!user) {
    throw new Error(`Mock user(${id}, ${type})를 찾을 수 없습니다.`);
  }

  return user;
}

export const mockUserSummaries: UserSummary[] = [
  // 로그인 계정 (개인모드 & 기업모드)
  {
    id: 1,
    profileType: 'personal',
    nickname: '김치즈',
    email: 'cheese@test.com',
    profileImageUrl: '/mock/profile-3.png',
  },
  {
    id: 1,
    profileType: 'company',
    nickname: '치즈공장',
    email: 'cheese@test.com',
    profileImageUrl: '/mock/profile-6.png',
  },

  {
    id: 2,
    profileType: 'company',
    nickname: '유옥천',
    email: 'you@test.com',
    profileImageUrl: '/mock/profile-4.png',
  },
  {
    id: 3,
    profileType: 'personal',
    nickname: '바람',
    email: 'wind@test.com',
    profileImageUrl: '',
  },
  {
    id: 4,
    profileType: 'company',
    nickname: '구름',
    email: 'cloud@test.com',
    profileImageUrl: '/mock/profile-6.png',
  },
  {
    id: 5,
    profileType: 'personal',
    nickname: '몽글이',
    email: 'mongle@test.com',
    profileImageUrl: '/mock/profile-1.png',
  },
  {
    id: 6,
    profileType: 'company',
    nickname: '감자칩',
    email: 'frontend@test.com',
    profileImageUrl: '/mock/profile-1.png',
  },
  {
    id: 7,
    profileType: 'personal',
    nickname: '하늘',
    email: 'backend@test.com',
    profileImageUrl: '/mock/profile-2.png',
  },
  {
    id: 8,
    profileType: 'personal',
    nickname: '유진',
    email: 'react@test.com',
    profileImageUrl: '',
  },
  {
    id: 9,
    profileType: 'company',
    nickname: '치즈냥',
    email: 'cloud@test.com',
    profileImageUrl: '/mock/profile-5.png',
  },
  {
    id: 10,
    profileType: 'company',
    nickname: '초록이',
    email: 'chocho@test.com',
    profileImageUrl: '',
  },
  {
    id: 11,
    profileType: 'personal',
    nickname: '한창우',
    profileImageUrl: '',
    email: 'changwoo@example.com',
  },
  {
    id: 12,
    profileType: 'personal',
    nickname: '김민준',
    profileImageUrl: '/mock/profile-5.png',
    email: 'minjun@example.com',
  },
  {
    id: 13,
    profileType: 'company',
    nickname: '박서연',
    profileImageUrl: '/mock/profile-4.png',
    email: 'seoyeon@example.com',
  },
  {
    id: 14,
    profileType: 'personal',
    nickname: '이도현',

    profileImageUrl: '/mock/profile-3.png',
    email: 'dohyeon@example.com',
  },
  {
    id: 15,
    profileType: 'company',
    nickname: '최지우',
    profileImageUrl: '',
    email: 'jiwoo@example.com',
  },
  {
    id: 16,
    profileType: 'personal',
    nickname: '정수지',
    profileImageUrl: '/mock/profile-6.png',
    email: 'sooji@example.com',
  },
  {
    id: 17,
    nickname: '토리',
    profileType: 'personal',
    email: 'tori@test.com',
    profileImageUrl: '/mock/profile-3.png',
  },
  {
    id: 18,
    nickname: '보리',
    profileType: 'company',
    email: 'bori@test.com',
    profileImageUrl: '/mock/profile-1.png',
  },
  {
    id: 19,
    nickname: '지훈',
    profileType: 'company',
    email: 'jhkim@test.com',
    profileImageUrl: '/mock/profile-2.png',
  },
  {
    id: 20,
    nickname: '도윤',
    profileType: 'personal',
    email: 'dodo@test.com',
    profileImageUrl: '',
  },
  {
    id: 21,
    nickname: '지민',
    profileType: 'company',
    email: 'jim@test.com',
    profileImageUrl: '/mock/profile-4.png',
  },
  {
    id: 22,
    nickname: '초보개발자',
    profileType: 'personal',
    email: 'developer@test.com',
    profileImageUrl: '/mock/profile-5.png',
  },
];
