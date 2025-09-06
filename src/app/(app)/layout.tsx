
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  let userRole = 'Worker'; // Default role
  if (user.email === 'happychicks@admin.com' || profile?.role === 'Manager') {
      userRole = 'Manager';
  } else if (profile?.role === 'Sales Rep') {
      userRole = 'Sales Rep';
  } else if (profile?.role) {
      userRole = profile.role;
  }


  return (
    <AppLayout user={user} userRole={userRole}>
      <div className="h-full">
        {children}
      </div>
    </AppLayout>
  );
}
