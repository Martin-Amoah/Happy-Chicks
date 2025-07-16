
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, CircleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { NotificationSettingsForm } from "./notification-settings-form";
import { AccountSecurityForm } from "./account-security-form";
import { FarmConfigurationForm } from "./farm-configuration-form";

// A dedicated error component to avoid repeating JSX
function SettingsErrorCard({ message, details }: { message: string, details?: string }) {
    return (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2"><CircleAlert /> Error Loading Settings</CardTitle>
                <CardDescription>
                    {message}
                    {details && <div className="mt-2 text-xs text-muted-foreground bg-destructive p-2 rounded-md">Error details: {details}</div>}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}

export default async function SettingsPage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        // This redirect should be handled by the layout, but as a safeguard:
        return redirect('/login');
    }

    const [profileResponse, farmConfigResponse] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).limit(1).single(),
        supabase.from('farm_config').select('*').eq('id', 1).limit(1).single() // Assuming a single config row with id 1
    ]);
    
    // Non-fatal errors (like row not found) are handled below by checking the data.
    // We only need to catch actual database connection errors here.
    if (profileResponse.error && profileResponse.error.code !== 'PGRST116') {
        console.error("Supabase profile error:", profileResponse.error.message);
        return <SettingsErrorCard message="Could not load your user profile from the database." details={profileResponse.error.message} />;
    }
    
    if (farmConfigResponse.error && farmConfigResponse.error.code !== 'PGRST116') {
        console.error("Supabase farm config error:", farmConfigResponse.error.message);
        return <SettingsErrorCard message="Could not load the farm configuration from the database." details={farmConfigResponse.error.message} />;
    }

    const profile = profileResponse.data;
    const farmConfig = farmConfigResponse.data;
    
    // Check if the user has the manager role. This is safe even if profile is null.
    const isManager = profile?.role === 'Manager';

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Settings2 className="h-6 w-6 text-primary" /> Application Settings
                    </CardTitle>
                    <CardDescription>Manage your Happy Chicks application preferences and settings.</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {profile ? (
                    <NotificationSettingsForm profile={profile} />
                ) : (
                    <SettingsErrorCard message="Notification settings are unavailable because a user profile has not been created." />
                )}
                <AccountSecurityForm email={user.email ?? 'No email available'} />
            </div>
            
            {isManager && (
                farmConfig ? (
                    <FarmConfigurationForm config={farmConfig} />
                ) : (
                     <SettingsErrorCard message="Farm configuration is unavailable." details="No configuration data found in the database. A manager may need to set this up." />
                )
            )}
        </div>
    );
}
