
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

  // Fetch profile and farm config in parallel
  const [profileResult, farmConfigResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('farm_config').select('*').eq('id', 1).single()
  ]);

  const { data: profile, error: profileError } = profileResult;
  const { data: farmConfig, error: farmConfigError } = farmConfigResult;

  if (profileError || !profile || farmConfigError || !farmConfig) {
      const errorMessage = profileError?.message || farmConfigError?.message || "Your user profile or farm configuration could not be loaded.";
      console.error("Error fetching settings data:", errorMessage);
      return (
          <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Error Loading Settings</CardTitle>
                <CardDescription>
                    {`Could not fetch settings data: ${errorMessage}. Please refresh the page. If the problem persists, check your database connection and RLS policies.`}
                </CardDescription>
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
          </Title>
          <CardDescription>Manage your CluckTrack application preferences and settings.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <NotificationSettingsForm profile={profile} />
        <AccountSecurityForm email={user.email ?? 'No email available'} />
      </div>
      
      {isManager && <FarmConfigurationForm config={farmConfig} />}
    </div>
  );
}
