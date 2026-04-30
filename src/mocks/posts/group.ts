export const groupPosts = [
  {
    id: 1,
    field: 'FE',
    title: '취업 포트폴리오 스터디 함께하실 분 모집합니다',
    recruitCount: 4,
    expectedPeriod: '4주',
    author: {
      nickname: '한창우',
      profileImageUrl: '/images/mock/profile-1.png',
    },
    deadline: '02.10(화) 마감',
    likeCount: 24,
    commentCount: 8,
  },
  {
    id: 2,
    field: 'BE',
    title: 'Spring Boot 사이드 프로젝트 팀원 모집',
    recruitCount: 3,
    expectedPeriod: '8주',
    author: {
      nickname: '김민준',
      profileImageUrl: '/images/mock/profile-2.png',
    },
    deadline: '상시모집',
    likeCount: 17,
    commentCount: 5,
  },
] as const;
