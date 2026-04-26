import { AccountSettingsProps } from './types';
import { getAccountItems } from './profile.data';
import ProfileItem from './ProfileItem';

export default function AccountSettings({ profile }: AccountSettingsProps) {
  const accountItems = getAccountItems(profile);

  return (
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
  );
}
