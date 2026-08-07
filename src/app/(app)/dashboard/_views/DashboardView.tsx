import DashboardCommunitySection from '../_components/DashboardCommunitySection';
import DashboardGreetingSection from '../_components/DashboardGreeting';
import DashboardInterviewPractice from '../_components/DashboardInterviewPractice';
import DashboardUpcomingEvents from '../_components/DashboardUpcomingEvents';

export default function DashboardView() {
  return (
    <div className="h-dvh overflow-y-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto max-w-[1100px] px-10 pt-10 pb-28">
        <DashboardGreetingSection />
        <DashboardUpcomingEvents />
        <DashboardInterviewPractice />
        <DashboardCommunitySection />
      </div>
    </div>
  );
}
