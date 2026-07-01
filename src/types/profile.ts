export type PersonalProfile = {
  id: number;
  nickname: string;
  email: string;
  profileImageUrl?: string;

  interestedJob: string;
  coverLetter: ProfileDocument;
  additionalDocument: ProfileDocument;
  skills: string[];
  interests: string[];
};

export type CompanyProfile = {
  id: number;
  nickname: string;
  email: string;
  profileImageUrl?: string;

  representativeName: string;
  companyType: string;
  resumeTemplate: ProfileDocument;
  industryType: string[];
  employeeCount: number;
  foundedAt: string;
};

export type ProfileDocument = {
  fileName: string;
  fileUrl?: string;
  url: string;
  urlLabel?: string;
};
