
import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/AppLayout';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Happy Chicks - Farm Management System',
  description: 'Automated Farm Management System for Happy Chicks',
};

export default async function AuthenticatedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { pathname } = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002');
  if (user && (pathname === '/login' || pathname === '/')) {
      return redirect('/dashboard');
  }

  return (
    <AppLayout user={user}>
      {children}
    </AppLayout>
  );
}
