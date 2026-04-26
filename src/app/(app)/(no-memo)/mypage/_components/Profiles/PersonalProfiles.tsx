import { getPersonalProfileItems } from './profile.data';
import ProfileItem from './ProfileItem';
import { PersonalProfilesProps } from './types';

export default function PersonalProfiles({ profile }: PersonalProfilesProps) {
  const profileItems = getPersonalProfileItems(profile);

  return (
    <div>
      <div>
        {profileItems.map((item) => (
          <div key={item.label} className="border-b border-gray-300 p-3 last:border-b-0">
            <ProfileItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
