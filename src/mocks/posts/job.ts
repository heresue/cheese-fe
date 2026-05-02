import { JobPost } from '@/components/boards/jobs/types';

export const jobPosts: JobPost[] = [
  {
    id: 1,
    companyName: '치즈공장',
    title: '2026년 스타트업 인턴 부문 경력직 채용',
    skills: ['React', 'TypeScript', 'Next.js'],
    career: '신입, 경력',
    education: '고졸 ↑',
    location: '광주 광산구',
    employmentType: '인턴직',
    deadline: '02.03(화) 마감',
    apply: {
      type: 'homepage',
      url: 'https://google.com',
    },
  },
  {
    id: 2,
    companyName: '프론트랩',
    title: '프론트엔드 개발자 정규직 채용',
    skills: ['JavaScript', 'React', 'Tailwind CSS'],
    career: '경력 1년 ↑',
    education: '학력무관',
    location: '서울 강남구',
    employmentType: '정규직',
    deadline: '02.14(토) 마감',
    apply: {
      type: 'direct',
    },
  },
];
