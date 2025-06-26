
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { NotificationSettingsForm } from "./notification-settings-form";
import { AccountSecurityForm } from "./account-security-form";
import { FarmConfigurationForm } from "./farm-configuration-form";

export default async function SettingsPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const profilePromise = supabase.from('profiles').select('*').eq('id', user.id).single();
  const farmConfigPromise = supabase.from('farm_config').select('*').eq('id', 1).single();

  const [{ data: profile }, { data: farmConfig }] = await Promise.all([profilePromise, farmConfigPromise]);
  
  if (!profile || !farmConfig) {
      return (
          <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Error Loading Settings</CardTitle>
                <CardDescription>Could not fetch settings data. Please ensure the database migration has been run.</CardDescription>
              </CardHeader>
          </Card>
      );
  }

  const isManager = profile.role === 'Manager';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" /> Application Settings
          </CardTitle>
          <CardDescription>Manage your CluckTrack application preferences and settings.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <NotificationSettingsForm profile={profile} />
        <AccountSecurityForm email={user.email!} />
      </div>
      
      {isManager && <FarmConfigurationForm config={farmConfig} />}
    </div>
  );
}
