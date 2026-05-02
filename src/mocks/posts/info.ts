export const infoPosts = [
  {
    id: 1,
    thumbnailUrl: '/mock/info-1.png',
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
    thumbnailUrl: '/mock/info-2.png',
    category: '질문글',
    title: 'Next.js App Router에서 인증 처리 어떻게 하시나요?',
    content:
      '쿠키 기반 인증과 클라이언트 상태 관리를 함께 사용할 때 구조를 어떻게 잡는지 궁금합니다.',
    tags: ['Next.js', '인증', 'React Query'],
    viewCount: 642,
    likeCount: 31,
    commentCount: 9,
  },
  {
    id: 3,
    thumbnailUrl: '/mock/info-3.png',
    category: '정보글',
    title: 'React Query와 Zustand 함께 사용할 때 상태 분리 기준',
    content:
      '서버 상태와 클라이언트 상태를 어떤 기준으로 나누는지, 그리고 두 라이브러리를 함께 사용할 때의 패턴을 정리했습니다.',
    tags: ['React Query', 'Zustand', '상태관리'],
    viewCount: 954,
    likeCount: 57,
    commentCount: 11,
  },
  {
    id: 4,
    thumbnailUrl: '/mock/info-4.png',
    category: '질문글',
    title: 'Tailwind CSS에서 디자인 시스템 컬러 관리 어떻게 하세요?',
    content:
      '팔레트 토큰과 시멘틱 토큰을 어떻게 나누는지, 실무에서 어떤 방식이 유지보수에 좋은지 궁금합니다.',
    tags: ['Tailwind', '디자인시스템', 'CSS'],
    viewCount: 488,
    likeCount: 22,
    commentCount: 6,
  },
  {
    id: 5,
    thumbnailUrl: '/mock/info-5.png',
    category: '정보글',
    title: '면접에서 자주 나오는 CS 질문 정리 (프론트엔드)',
    content:
      '이벤트 루프, 클로저, 렌더링 과정 등 프론트엔드 면접에서 자주 등장하는 CS 질문들을 정리했습니다.',
    tags: ['CS', '면접', 'JavaScript'],
    viewCount: 1720,
    likeCount: 103,
    commentCount: 25,
  },
  {
    id: 6,
    thumbnailUrl: '/mock/info-6.png',
    category: '질문글',
    title: 'Next.js에서 이미지 최적화 전략 어떻게 가져가시나요?',
    content:
      'next/image 사용 시 성능 개선을 위해 어떤 옵션을 사용하는지, 그리고 CDN과 함께 사용할 때의 구조가 궁금합니다.',
    tags: ['Next.js', '이미지최적화', '성능'],
    viewCount: 531,
    likeCount: 28,
    commentCount: 7,
  },
] as const;
