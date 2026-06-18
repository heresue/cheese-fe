import { JobPost } from '@/components/community/jobs/types';

export const jobPosts: JobPost[] = [
  {
    id: 1,
    companyName: '치즈공장',
    title: '2026년 스타트업 인턴 부문 경력직 채용',

    author: {
      id: 1,
      nickname: '토리',
      email: 'cheese@test.com',
      profileImageUrl: '/mock/profile-3.png',
    },

    skills: ['React', 'TypeScript', 'Next.js'],
    career: '신입, 경력',
    education: '고졸 ↑',
    location: '광주 광산구',
    employmentType: '인턴직',

    deadline: '2026-02-03',
    createdAt: '2026-01-10',
    viewCount: 128,
    likeCount: 24,

    apply: {
      type: 'homepage',
      url: 'https://google.com',
    },

    isLiked: false,
    isApplied: true,
  },
  {
    id: 2,
    companyName: '프론트랩',
    title: '프론트엔드 개발자 정규직 채용',

    author: {
      id: 2,
      nickname: '보리',
      email: 'frontend@test.com',
      profileImageUrl: '/mock/profile-1.png',
    },

    skills: ['JavaScript', 'React', 'Tailwind CSS'],
    career: '경력 1년 ↑',
    education: '학력무관',
    location: '서울 강남구',
    employmentType: '정규직',

    deadline: '2026-02-14',
    createdAt: '2026-01-14',
    viewCount: 246,
    likeCount: 87,

    apply: {
      type: 'direct',
    },

    isLiked: true,
    isApplied: true,
  },
  {
    id: 3,
    companyName: '백엔드코어',
    title: 'Spring Boot 기반 백엔드 개발자 모집',

    author: {
      id: 3,
      nickname: '지훈',
      email: 'backend@test.com',
      profileImageUrl: '/mock/profile-2.png',
    },

    skills: ['Java', 'Spring Boot', 'MySQL'],
    career: '경력 2년 ↑',
    education: '대졸 ↑',
    location: '서울 마포구',
    employmentType: '정규직',

    deadline: '2026-02-20',
    createdAt: '2026-01-18',
    viewCount: 173,
    likeCount: 42,

    apply: {
      type: 'homepage',
      url: 'https://naver.com',
    },

    isLiked: false,
    isApplied: false,
  },
  {
    id: 4,
    companyName: 'UI팩토리',
    title: 'UI/UX 중심 프론트엔드 개발자 채용',

    author: {
      id: 4,
      nickname: '도윤',
      email: 'design@test.com',
      profileImageUrl: '',
    },

    skills: ['Figma', 'React', 'CSS'],
    career: '신입',
    education: '학력무관',
    location: '부산 해운대구',
    employmentType: '계약직',

    deadline: null,
    createdAt: '2026-01-22',
    viewCount: 201,
    likeCount: 65,

    apply: {
      type: 'direct',
    },

    isLiked: true,
    isApplied: false,
  },
  {
    id: 5,
    companyName: '데브스테이션',
    title: 'Next.js 기반 웹 서비스 개발자 채용',

    author: {
      id: 5,
      nickname: '지민',
      email: 'react@test.com',
      profileImageUrl: '/mock/profile-4.png',
    },

    skills: ['Next.js', 'TypeScript', 'React Query'],
    career: '경력 3년 ↑',
    education: '대졸 ↑',
    location: '서울 서초구',
    employmentType: '정규직',

    deadline: '2026-02-28',
    createdAt: '2026-01-25',
    viewCount: 389,
    likeCount: 113,

    apply: {
      type: 'homepage',
      url: 'https://github.com',
    },

    isLiked: true,
    isApplied: false,
  },
  {
    id: 6,
    companyName: '클라우드웨이',
    title: '클라우드 기반 백엔드 개발자 채용 (AWS)',

    author: {
      id: 6,
      nickname: '초보개발자',
      email: 'cloud@test.com',
      profileImageUrl: '/mock/profile-5.png',
    },

    skills: ['Node.js', 'AWS', 'Docker'],
    career: '경력 2년 ↑',
    education: '학력무관',
    location: '경기 성남시',
    employmentType: '정규직',

    deadline: '2026-03-05',
    createdAt: '2026-01-28',
    viewCount: 312,
    likeCount: 38,

    apply: {
      type: 'homepage',
      url: 'https://aws.amazon.com',
    },

    isLiked: true,
    isApplied: false,
  },
];
