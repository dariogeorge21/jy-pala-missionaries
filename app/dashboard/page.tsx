import { getAllMissionaries } from '@/lib/missionaries';
import { getCustomCourses } from '@/lib/missionaries';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const [missionaries, customCourses] = await Promise.all([
    getAllMissionaries(),
    getCustomCourses(),
  ]);

  return (
    <DashboardClient
      initialMissionaries={missionaries}
      initialCustomCourses={customCourses}
    />
  );
}
