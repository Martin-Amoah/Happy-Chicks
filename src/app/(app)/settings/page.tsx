
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { NotificationSettingsForm } from "./notification-settings-form";
import { AccountSecurityForm } from "./account-security-form";
import { FarmConfigurationForm } from "./farm-configuration-form";

// Define a simple error component to avoid repeating JSX
function SettingsErrorCard({ message }: { message: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-destructive">Error Loading Settings</CardTitle>
                <CardDescription>
                    {`Could not fetch settings data: ${message}. Please refresh the page. If the problem persists, check your database connection and RLS policies.`}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}

export default async function SettingsPage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        console.error("Error fetching profile:", profileError?.message);
        return <SettingsErrorCard message={profileError?.message || "User profile not found."} />;
    }

    // Fetch farm configuration
    const { data: farmConfig, error: farmConfigError } = await supabase
        .from('farm_config')
        .select('*')
        .eq('id', 1) // Assuming a single config row with id 1
        .single();
    
    if (farmConfigError || !farmConfig) {
        console.error("Error fetching farm config:", farmConfigError?.message);
        return <SettingsErrorCard message={farmConfigError?.message || "Farm configuration not found."} />;
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
