import {
  getAccountItems,
  getProfileItems,
  PersonalProfile,
} from '@/app/(app)/(no-memo)/mypage/_components/PersonalProfiles/personalProfile.data';
import ProfileItem from './ProfileItem';

type PersonalProfilesProps = {
  profile: PersonalProfile;
};

export default function PersonalProfiles({ profile }: PersonalProfilesProps) {
  const profileItems = getProfileItems(profile);
  const accountItems = getAccountItems(profile);

  return (
    <div>
      <div>
        {profileItems.map((item) => (
          <div key={item.label} className="border-b border-gray-300 p-3 last:border-b-0">
            <ProfileItem {...item} />
          </div>
        ))}
      </div>

      <div>
        <h2 className="mt-8 text-[20px] font-medium text-gray-700">계정 설정</h2>

        <div className="mt-5">
          {accountItems.map((item) => (
            <div key={item.label} className="border-b border-gray-300 p-3 last:border-b-0">
              <ProfileItem {...item} buttonClassName={item.danger ? '!text-error-subtle' : ''} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
