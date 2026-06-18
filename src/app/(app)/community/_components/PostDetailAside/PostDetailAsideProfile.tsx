import { Button } from '@/components/common/Button';
import { ProfileImage } from '@/components/common/ProfileImage';

type PostDetailAsideProfileProps = {
  nickname: string;
  email: string;
  profileImageUrl?: string;
};

export function PostDetailAsideProfile({
  nickname,
  email,
  profileImageUrl,
}: PostDetailAsideProfileProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4 border-b border-gray-300 py-10">
      <div className="flex flex-col items-center gap-3">
        <ProfileImage size={100} src={profileImageUrl} />

        <div className="flex flex-col gap-1 text-center leading-[30px]">
          <span className="text-[20px] font-bold break-words">{nickname}</span>
          <span className="break-all">{email}</span>
        </div>
      </div>

      <Button fullWidth variant="outlineGray" className="border-gray-400" size={44}>
        {/* TODO: 기업 프로필 모달 열기 */}
        기업 정보 알아보기
      </Button>
    </div>
  );
}
