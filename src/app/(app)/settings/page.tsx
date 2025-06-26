
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

  let profile;
  let farmConfig;

  try {
    const profilePromise = supabase.from('profiles').select('*').eq('id', user.id).single();
    const farmConfigPromise = supabase.from('farm_config').select('*').eq('id', 1).single();

    const [profileResult, farmConfigResult] = await Promise.all([
      profilePromise,
      farmConfigPromise,
    ]);
    
    // Throw if either Supabase query returned an error
    if (profileResult.error) throw profileResult.error;
    if (farmConfigResult.error) throw farmConfigResult.error;

    profile = profileResult.data;
    farmConfig = farmConfigResult.data;

  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return (
        <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Settings</CardTitle>
              <CardDescription>
                Could not fetch settings data: {error.message}. Please try refreshing the page. If the problem persists, check the server logs.
              </CardDescription>
            </CardHeader>
        </Card>
    );
  }
  
  if (!profile || !farmConfig) {
      return (
          <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Settings Data Not Found</CardTitle>
                <CardDescription>Could not find your profile or the farm configuration. Please ensure the database migration scripts have been run correctly.</CardDescription>
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
        <AccountSecurityForm email={user.email ?? 'No email available'} />
      </div>
      
      {isManager && <FarmConfigurationForm config={farmConfig} />}
    </div>
  );
}
