import { KpiCard } from "@/components/dashboard/KpiCard";
import { SampleBarChart } from "@/components/charts/SampleBarChart";
import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { TrendingUp, Users, Package, AlertTriangle, Feather, Activity } from "lucide-react";
import { BirdIcon } from "@/components/icons/BirdIcon";
import { EggIcon } from "@/components/icons/EggIcon";
import { FeedIcon } from "@/components/icons/FeedIcon";


const eggProductionData = [
  { date: "Week 1", value: 75 },
  { date: "Week 2", value: 78 },
  { date: "Week 3", value: 82 },
  { date: "Week 4", value: 80 },
  { date: "Week 5", value: 85 },
  { date: "Week 6", value: 83 },
];

const feedConsumptionData = [
  { category: "Shed A", current: 120, optimal: 110 },
  { category: "Shed B", current: 150, optimal: 140 },
  { category: "Shed C", current: 100, optimal: 100 },
  { category: "Shed D", current: 130, optimal: 125 },
];

const mortalityRateData = [
  { date: "Jan", value: 2.1 },
  { date: "Feb", value: 1.8 },
  { date: "Mar", value: 1.5 },
  { date: "Apr", value: 1.9 },
  { date: "May", value: 1.2 },
  { date: "Jun", value: 1.0 },
];


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Egg Production Rate"
          value="82%"
          icon={<EggIcon className="h-6 w-6 text-accent" />}
          description="Average daily lay rate"
          trend="+2% from last week"
          trendColor="text-green-600"
        />
        <KpiCard
          title="Feed Consumption"
          value="550 kg/day"
          icon={<FeedIcon className="h-6 w-6 text-accent" />}
          description="Total daily feed usage"
          trend="-10kg from yesterday"
          trendColor="text-green-600"
        />
        <KpiCard
          title="Mortality Rate"
          value="1.5%"
          icon={<BirdIcon className="h-6 w-6 text-destructive" />}
          description="Current monthly average"
          trend="+0.1% from last month"
          trendColor="text-red-600"
        />
        <KpiCard
          title="Active Birds"
          value="5,320"
          icon={<BirdIcon className="h-6 w-6 text-accent" />}
          description="Total birds currently active"
        />
        <KpiCard
          title="Broken Eggs"
          value="25/day"
          icon={<TrendingUp className="h-6 w-6 text-destructive" />}
          description="Average daily broken eggs"
          trend="-5 from yesterday"
          trendColor="text-green-600"
        />
         <KpiCard
          title="Feed Inventory"
          value="120 Bags"
          icon={<Package className="h-6 w-6 text-accent" />}
          description="Layers Mash Stock"
          trend="Low stock alert"
          trendColor="text-red-600"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <SampleLineChart
          title="Egg Production Trend"
          description="Weekly egg production rate over the last 6 weeks."
          data={eggProductionData}
          dataKeys={{x: "date", y: "value"}}
          config={{ value: { label: "Production (%)", color: "hsl(var(--chart-1))" } }}
        />
        <SampleBarChart
          title="Feed Consumption Analysis"
          description="Current vs Optimal feed consumption per shed (kg)."
          data={feedConsumptionData}
          dataKeys={{x: "category", y1: "current", y2: "optimal"}}
          config={{
            desktop: { label: "Current", color: "hsl(var(--chart-2))" }, // Renaming for context
            mobile: { label: "Optimal", color: "hsl(var(--chart-3))" }, // Renaming for context
          }}
        />
      </div>
       <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
         <SampleLineChart
          title="Mortality Rate Trend"
          description="Monthly mortality rate over the last 6 months."
          data={mortalityRateData}
          dataKeys={{x: "date", y: "value"}}
          config={{ value: { label: "Mortality (%)", color: "hsl(var(--chart-5))" } }}
        />
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline">Farm Activity Log</CardTitle>
            <CardDescription>Recent activities and alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center p-2 rounded-md bg-muted/50">
              <Activity className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium">New feed batch (50 bags) recorded by John Doe.</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-2 rounded-md bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive mr-3" />
               <div>
                <p className="text-sm font-medium">High mortality reported in Shed C.</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
             <div className="flex items-center p-2 rounded-md bg-muted/50">
              <Feather className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium">Scheduled vaccination for Shed A completed.</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
