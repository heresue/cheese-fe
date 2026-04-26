import { CompanyProfilesProps } from './types';
import { getCompanyProfileItems } from './profile.data';
import ProfileItem from './ProfileItem';

export default function CompanyProfiles({ profile }: CompanyProfilesProps) {
  const profileItems = getCompanyProfileItems(profile);

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
