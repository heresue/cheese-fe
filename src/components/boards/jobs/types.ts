export type ApplyInfo =
  | {
      type: 'homepage';
      url: string;
    }
  | {
      type: 'direct';
    };

export type JobPost = {
  id: number;
  companyName: string;
  title: string;
  skills: string[];
  career: string;
  education: string;
  location: string;
  employmentType: string;
  deadline: string;
  apply: ApplyInfo;
  isLiked: boolean;
  isApplied: boolean;
};
