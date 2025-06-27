
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Fetch profile first
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error("Error fetching settings data (profile):", profileError);
    return (
        <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Settings</CardTitle>
              <CardDescription>Could not fetch your profile data: {profileError.message}. Please refresh the page.</CardDescription>
            </CardHeader>
        </Card>
    );
  }
  
  if (!profile) {
      return (
          <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Settings Data Missing</CardTitle>
                <CardDescription>Your user profile was not found. Please ensure the database migration scripts have run correctly.</CardDescription>
              </CardHeader>
          </Card>
      );
  }
  
  // Fetch farm config second
  const { data: farmConfig, error: farmConfigError } = await supabase
    .from('farm_config')
    .select('*')
    .eq('id', 1)
    .single();

  if (farmConfigError) {
    console.error("Error fetching settings data (farm config):", farmConfigError);
    return (
        <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Settings</CardTitle>
              <CardDescription>Could not fetch farm configuration: {farmConfigError.message}. Please refresh the page.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  if (!farmConfig) {
      return (
          <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Settings Data Missing</CardTitle>
                <CardDescription>The farm configuration was not found. Please ensure the database migration scripts have run correctly.</CardDescription>
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
      
      {isManager ? <FarmConfigurationForm config={farmConfig} /> : null}
    </div>
  );
}
