
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

  // Fetch profile and farm config in parallel for efficiency
  const [profileResponse, farmConfigResponse] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('farm_config').select('*').eq('id', 1).single()
  ]);

  const { data: profile, error: profileError } = profileResponse;
  const { data: farmConfig, error: farmConfigError } = farmConfigResponse;

  // Gracefully handle any database errors first
  if (profileError || farmConfigError) {
    const errorMessage = profileError?.message || farmConfigError?.message || "An unknown database error occurred.";
    console.error("Error fetching settings data. Profile error:", profileError, "Farm config error:", farmConfigError);
    return (
        <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Settings</CardTitle>
              <CardDescription>
                Could not fetch settings data: {errorMessage}. Please refresh the page. If the problem persists, check your database connection and ensure the tables `profiles` and `farm_config` exist.
              </CardDescription>
            </CardHeader>
        </Card>
    );
  }
  
  // Handle cases where data is not found (e.g., initial setup)
  if (!profile || !farmConfig) {
      let errorDescription = "";
      if (!profile) errorDescription += "Your user profile was not found. ";
      if (!farmConfig) errorDescription += "The farm configuration was not found. ";

      return (
          <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Settings Data Missing</CardTitle>
                <CardDescription>
                    {errorDescription}
                    Please ensure the database migration scripts have been run correctly and that RLS policies allow access. Your user profile might need to be created manually if you are the first user.
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
