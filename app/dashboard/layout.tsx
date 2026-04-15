import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardContainer } from '@/components/dashboard/DashboardContainer';

export const metadata: Metadata = {
  title: 'Dashboard – JY Pala Missionaries',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jyp_auth');
  if (!token || token.value !== 'authenticated') {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      <DashboardNav />
      <main className="flex-1 w-full py-6">
        <DashboardContainer>
          {children}
        </DashboardContainer>
      </main>
    </div>
  );
}
