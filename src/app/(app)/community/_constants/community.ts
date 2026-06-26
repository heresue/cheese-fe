export const COMMUNITY_CATEGORY_TABS = [
  { label: '채용공고', value: '/community/jobs' },
  { label: '그룹모집', value: '/community/groups' },
  { label: '정보/자료공유', value: '/community/info' },
] as const;

export const COMMUNITY_SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '마감일순', value: 'deadline' },
  { label: '좋아요순', value: 'like' },
] as const;

export const INFO_SORT_OPTIONS = [
  { label: '전체', value: 'all' },
  { label: '질문글', value: 'question' },
  { label: '정보글', value: 'info' },
  { label: '자료공유', value: 'resource' },
] as const;

// Post Form Dropdown Options

export const FIELD_OPTIONS = [
  { label: 'FE', value: 'FE' },
  { label: 'BE', value: 'BE' },
];

export const EMPLOYMENT_TYPE_OPTIONS = [
  { label: '인턴직', value: 'intern' },
  { label: '계약직', value: 'contract' },
  { label: '정규직', value: 'fullTime' },
];

export const EDUCATION_OPTIONS = [
  { label: '대졸', value: 'college' },
  { label: '초대졸', value: 'associate' },
  { label: '고졸', value: 'highSchool' },
  { label: '대학원(석사/박사)', value: 'graduateSchool' },
  { label: '학력무관', value: 'none' },
];

export const WORK_METHOD_OPTIONS = [
  { label: '온라인', value: 'online' },
  { label: '오프라인', value: 'offline' },
  { label: '온/오프라인 병행', value: 'hybrid' },
];
