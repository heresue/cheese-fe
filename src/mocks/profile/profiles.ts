export const mockPersonalProfile = {
  id: 1,
  nickname: '김치즈',
  profileImageUrl: '/mock/profile-3.png',
  interestedJob: 'FE (프론트엔드)',
  coverLetter: {
    fileName: '자기소개서_김치즈.pdf',
    fileUrl: 'https://google.com',
    url: 'https://google.com',
  },
  resume: {
    fileName: '이력서_김치즈.pdf',
    fileUrl: 'https://google.com',
    url: 'https://google.com',
  },
  skills: ['HTML5', 'CSS3', 'JavaScript'],
  interests: ['Redux', 'Zustand', 'Recoil', 'Context API'],
};

export const mockCompanyProfile = {
  nickname: '치즈공장',
  profileImageUrl: '/mock/profile-6.png',
  representativeName: '변대환',
  companyType: '스타트업',
  resumeTemplate: {
    fileName: 'cheese_resume_template.pdf',
    fileUrl: 'https://google.com',
    url: 'https://google.com',
  },
  industryType: ['솔루션 SI', 'CRM', 'ERP'],
  employeeCount: 10,
  foundedAt: '2020-05-15',
};

export const mockAccountSettings = {
  contact: '이메일/오픈카카오톡',
  email: 'test@test.com',
  passwordUpdatedAt: '2026-01-30',
  address: '서울특별시',
};
