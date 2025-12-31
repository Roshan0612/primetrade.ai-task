import { ProfileCard } from '@/components/dashboard/ProfileCard';
import { TaskList } from '@/components/dashboard/TaskList';

export default function DashboardPage() {
  return (
    <div className="space-y-8 fade-in">
      <div className="mb-8 fade-in-up">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome!</h1>
        <p className="text-gray-600">Manage your tasks efficiently</p>
      </div>

      <ProfileCard />
      <TaskList />
    </div>
  );
}
