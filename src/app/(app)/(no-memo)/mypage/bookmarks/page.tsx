import JobBookmarkList from '@/app/(app)/(no-memo)/mypage/bookmarks/_components/JobBookmarkList';
import GroupBookmarkList from '@/app/(app)/(no-memo)/mypage/bookmarks/_components/GroupBookmarkList';
import InfoBookmarkList from '@/app/(app)/(no-memo)/mypage/bookmarks/_components/InfoBookmarkList';
import { Tab, TabList, TabPanel, Tabs } from '@/components/common/Tabs';

export default function BookmarksPage() {
  return (
    <div>
      <Tabs defaultValue="jobs">
        <TabList>
          <Tab value="jobs">채용공고</Tab>
          <Tab value="groups">그룹모집</Tab>
          <Tab value="infos">정보/자료공유</Tab>
        </TabList>

        <TabPanel value="jobs">
          <div className="mt-5 flex flex-col gap-5">
            <JobBookmarkList />
          </div>
        </TabPanel>

        <TabPanel value="groups">
          <div className="mt-5">
            <GroupBookmarkList />
          </div>
        </TabPanel>
        <TabPanel value="infos">
          <div className="mt-5">
            <InfoBookmarkList />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
