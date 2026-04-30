export const infoPosts = [
  {
    id: 1,
    thumbnailUrl: '/images/mock/info-1.png',
    category: '정보글',
    title: '신입 프론트엔드 포트폴리오 구성 팁 정리',
    content:
      '포트폴리오를 만들 때 프로젝트 설명, 문제 해결 과정, 기술 선택 이유를 어떻게 정리하면 좋은지 공유합니다.',
    tags: ['포트폴리오', '프론트엔드', '취업준비'],
    viewCount: 1280,
    likeCount: 86,
    commentCount: 14,
  },
  {
    id: 2,
    thumbnailUrl: '/images/mock/info-2.png',
    category: '질문글',
    title: 'Next.js App Router에서 인증 처리 어떻게 하시나요?',
    content:
      '쿠키 기반 인증과 클라이언트 상태 관리를 함께 사용할 때 구조를 어떻게 잡는지 궁금합니다.',
    tags: ['Next.js', '인증', 'React Query'],
    viewCount: 642,
    likeCount: 31,
    commentCount: 9,
  },
] as const;
