import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, Bell, ShieldCheck, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
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
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><Bell className="h-5 w-5 text-accent" /> Notifications</CardTitle>
            <CardDescription>Configure your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
              <Label htmlFor="lowStockAlerts" className="flex flex-col space-y-1">
                <span>Low Stock Alerts</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive notifications for low feed inventory.
                </span>
              </Label>
              <Switch id="lowStockAlerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
              <Label htmlFor="highMortalityAlerts" className="flex flex-col space-y-1">
                <span>High Mortality Alerts</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Get alerted for unusual spikes in mortality rates.
                </span>
              </Label>
              <Switch id="highMortalityAlerts" />
            </div>
             <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
              <Label htmlFor="dailySummary" className="flex flex-col space-y-1">
                <span>Daily Summary Email</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive a daily summary of farm operations.
                </span>
              </Label>
              <Switch id="dailySummary" defaultChecked />
            </div>
          </CardContent>
           <CardContent>
            <Button>Save Notification Preferences</Button>
           </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-accent" /> Account & Security</CardTitle>
            <CardDescription>Manage your account details and security settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="manager@clucktrack.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Change Password</Label>
              <Input id="password" type="password" placeholder="New Password" />
            </div>
            <Button>Update Account</Button>
          </CardContent>
        </Card>
      </div>
       <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><Users className="h-5 w-5 text-accent" /> Farm Configuration</CardTitle>
            <CardDescription>Set up farm-specific parameters.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1.5">
              <Label htmlFor="farmName">Farm Name</Label>
              <Input id="farmName" defaultValue="Happy Chicks Farm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shedCount">Number of Sheds</Label>
              <Input id="shedCount" type="number" defaultValue="5" />
            </div>
             <div className="space-y-1.5">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Input id="defaultCurrency" defaultValue="GHS" />
            </div>
             <div className="space-y-1.5">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="Africa/Accra" />
            </div>
          </CardContent>
           <CardContent>
            <Button>Save Farm Configuration</Button>
           </CardContent>
        </Card>
    </div>
  );
}
