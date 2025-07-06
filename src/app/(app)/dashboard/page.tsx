
import { createClient } from "@/lib/supabase/server";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SampleBarChart } from "@/components/charts/SampleBarChart";
import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, Activity } from "lucide-react";
import { BirdIcon } from "@/components/icons/BirdIcon";
import { EggIcon } from "@/components/icons/EggIcon";
import { FeedIcon } from "@/components/icons/FeedIcon";
import { 
  subDays, 
  startOfToday, 
  format, 
  eachWeekOfInterval, 
  startOfWeek,
  endOfWeek,
  eachMonthOfInterval,
  endOfMonth,
  subMonths
} from 'date-fns';

const BIRD_START_COUNT = 5500; // Assumption for initial bird count

async function getDashboardData() {
  const supabase = createClient();
  const today = startOfToday();
  const sixWeeksAgo = subDays(today, 42);
  const sixMonthsAgo = subMonths(today, 6);

  const [
    eggCollectionData,
    mortalityData,
    feedAllocationData,
    feedStockData
  ] = await Promise.all([
    supabase.from('egg_collections').select('*').gte('date', format(sixWeeksAgo, 'yyyy-MM-dd')),
    supabase.from('mortality_records').select('*').gte('date', format(sixMonthsAgo, 'yyyy-MM-dd')),
    supabase.from('feed_allocations').select('*').order('date', { ascending: false }),
    supabase.from('feed_stock').select('*').order('date', { ascending: false })
  ]);

  if (eggCollectionData.error || mortalityData.error || feedAllocationData.error || feedStockData.error) {
    console.error("Dashboard data fetch error:", 
      eggCollectionData.error?.message || mortalityData.error?.message || feedAllocationData.error?.message || feedStockData.error?.message
    );
    // Return empty/default data to prevent crash
    return {
      kpis: {
        eggProductionRate: 'N/A',
        feedConsumption: 'N/A',
        mortalityRate: 'N/A',
        activeBirds: 'N/A',
        brokenEggs: 'N/A',
        feedInventory: 'N/A',
        eggProductionTrend: 'N/A',
        feedConsumptionTrend: 'N/A',
        mortalityRateTrend: 'N/A',
        brokenEggsTrend: 'N/A'
      },
      charts: {
        eggProductionTrend: [],
        feedConsumptionAnalysis: [],
        mortalityRateTrend: []
      },
      activityLog: []
    };
  }

  const eggs = eggCollectionData.data || [];
  const mortalities = mortalityData.data || [];
  const allocations = feedAllocationData.data || [];
  const stocks = feedStockData.data || [];

  // --- KPI Calculations ---
  const todayStr = format(today, 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
  
  const totalMortality = mortalities.reduce((acc, curr) => acc + curr.count, 0);
  const activeBirds = BIRD_START_COUNT - totalMortality;

  const eggsToday = eggs.filter(e => e.date === todayStr);
  const eggsYesterday = eggs.filter(e => e.date === yesterdayStr);
  
  const totalEggsToday = eggsToday.reduce((acc, curr) => acc + curr.total_eggs, 0);
  const totalEggsYesterday = eggsYesterday.reduce((acc, curr) => acc + curr.total_eggs, 0);

  const eggProductionRate = activeBirds > 0 ? (totalEggsToday / activeBirds) * 100 : 0;
  const eggProductionRateYesterday = activeBirds > 0 ? (totalEggsYesterday / activeBirds) * 100 : 0;
  const eggProductionTrend = eggProductionRate - eggProductionRateYesterday;

  const feedToday = allocations.filter(a => a.date === todayStr);
  const feedYesterday = allocations.filter(a => a.date === yesterdayStr);
  const feedConsumptionToday = feedToday.reduce((acc, curr) => acc + curr.quantity_allocated, 0);
  const feedConsumptionYesterday = feedYesterday.reduce((acc, curr) => acc + curr.quantity_allocated, 0);
  const feedConsumptionTrend = feedConsumptionToday - feedConsumptionYesterday;

  const mortalityLast30Days = mortalities
    .filter(m => new Date(m.date) > subDays(today, 30))
    .reduce((acc, curr) => acc + curr.count, 0);
  const mortalityRate = activeBirds > 0 ? (mortalityLast30Days / (activeBirds + mortalityLast30Days)) * 100 : 0;
  
  const mortalityLastMonth = mortalities
    .filter(m => new Date(m.date) > subDays(today, 60) && new Date(m.date) <= subDays(today, 30))
    .reduce((acc, curr) => acc + curr.count, 0);
  const mortalityRateLastMonth = activeBirds > 0 && (activeBirds + mortalityLast30Days + mortalityLastMonth) > 0 ? (mortalityLastMonth / (activeBirds + mortalityLast30Days + mortalityLastMonth)) * 100 : 0;
  const mortalityRateTrend = mortalityRate - mortalityRateLastMonth;

  const brokenEggsToday = eggsToday.reduce((acc, curr) => acc + curr.broken_eggs, 0);
  const brokenEggsYesterday = eggsYesterday.reduce((acc, curr) => acc + curr.broken_eggs, 0);
  const brokenEggsTrend = brokenEggsToday - brokenEggsYesterday;

  const totalStock = stocks
    .filter(s => s.unit === 'bags')
    .reduce((acc, curr) => acc + curr.quantity, 0);
  const totalAllocated = allocations
    .filter(a => a.unit === 'bags')
    .reduce((acc, curr) => acc + curr.quantity_allocated, 0);
  const feedInventory = totalStock - totalAllocated;

  // --- Chart Data ---
  const weeklyEggData = eachWeekOfInterval({ start: sixWeeksAgo, end: today })
    .map((weekStart, i) => {
      const weekEnd = endOfWeek(weekStart);
      const weeklyEggs = eggs
        .filter(e => new Date(e.date + 'T00:00:00') >= weekStart && new Date(e.date + 'T00:00:00') <= weekEnd)
        .reduce((sum, e) => sum + e.total_eggs, 0);
      return { date: `W${i + 1}`, value: weeklyEggs };
    });

  const feedByShed = allocations.reduce((acc, curr) => {
    acc[curr.shed] = (acc[curr.shed] || 0) + curr.quantity_allocated;
    return acc;
  }, {} as Record<string, number>);
  const feedConsumptionAnalysis = Object.entries(feedByShed).map(([shed, total]) => ({
    category: shed,
    current: total
  }));

  const monthlyMortalityData = eachMonthOfInterval({ start: sixMonthsAgo, end: today })
    .map(monthStart => {
        const monthEnd = endOfMonth(monthStart);
        const monthlyDeaths = mortalities
            .filter(m => new Date(m.date + 'T00:00:00') >= monthStart && new Date(m.date + 'T00:00:00') <= monthEnd)
            .reduce((sum, m) => sum + m.count, 0);
        return { date: format(monthStart, 'MMM'), value: monthlyDeaths };
    });

  // --- Activity Log ---
  const latestAllocations = allocations.slice(0, 3).map(a => ({ type: 'feed_allocation', date: a.date, data: a }));
  const latestMortality = mortalities.slice(0, 3).map(m => ({ type: 'mortality', date: m.date, data: m }));
  const latestStock = stocks.slice(0, 3).map(s => ({ type: 'feed_stock', date: s.date, data: s }));
  
  const allActivities = [...latestAllocations, ...latestMortality, ...latestStock]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);


  return {
    kpis: {
      eggProductionRate: `${eggProductionRate.toFixed(1)}%`,
      feedConsumption: `${feedConsumptionToday} kg/day`,
      mortalityRate: `${mortalityRate.toFixed(1)}%`,
      activeBirds: activeBirds.toLocaleString(),
      brokenEggs: `${brokenEggsToday}/day`,
      feedInventory: `${feedInventory} Bags`,
      eggProductionTrend: `${eggProductionTrend >= 0 ? '+' : ''}${eggProductionTrend.toFixed(1)}% from yesterday`,
      feedConsumptionTrend: `${feedConsumptionTrend >= 0 ? '+' : ''}${feedConsumptionTrend}kg from yesterday`,
      mortalityRateTrend: `${mortalityRateTrend >= 0 ? '+' : ''}${mortalityRateTrend.toFixed(2)}% from last month`,
      brokenEggsTrend: `${brokenEggsTrend >= 0 ? '+' : ''}${brokenEggsTrend} from yesterday`
    },
    charts: {
      eggProductionTrend: weeklyEggData,
      feedConsumptionAnalysis,
      mortalityRateTrend: monthlyMortalityData
    },
    activityLog: allActivities
  }
}

export default async function DashboardPage() {
  const { kpis, charts, activityLog } = await getDashboardData();
  
  const ActivityIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'feed_allocation': return <FeedIcon className="h-5 w-5 text-blue-500 mr-3" />;
      case 'mortality': return <AlertTriangle className="h-5 w-5 text-destructive mr-3" />;
      case 'feed_stock': return <Package className="h-5 w-5 text-green-500 mr-3" />;
      default: return <Activity className="h-5 w-5 text-gray-500 mr-3" />;
    }
  };
  
  const activityText = (item: any) => {
    switch(item.type) {
      case 'feed_allocation':
        return `${item.data.quantity_allocated} ${item.data.unit} of ${item.data.feed_type} allocated to ${item.data.shed} by ${item.data.allocated_by}.`;
      case 'mortality':
        return `${item.data.count} mortalities recorded in ${item.data.shed}. Cause: ${item.data.cause || 'Unknown'}.`;
      case 'feed_stock':
        return `${item.data.quantity} ${item.data.unit} of ${item.data.feed_type} added to stock from ${item.data.supplier || 'supplier'}.`;
      default:
        return 'An activity was logged.';
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Egg Production Rate"
          value={kpis.eggProductionRate}
          icon={<EggIcon className="h-6 w-6 text-accent" />}
          description="Average daily lay rate"
          trend={kpis.eggProductionTrend}
          trendColor={kpis.eggProductionTrend.startsWith('+') ? 'text-green-600' : 'text-red-600'}
        />
        <KpiCard
          title="Feed Consumption"
          value={kpis.feedConsumption}
          icon={<FeedIcon className="h-6 w-6 text-accent" />}
          description="Total daily feed usage"
          trend={kpis.feedConsumptionTrend}
          trendColor={kpis.feedConsumptionTrend.startsWith('-') ? 'text-green-600' : 'text-red-600'}
        />
        <KpiCard
          title="Mortality Rate"
          value={kpis.mortalityRate}
          icon={<BirdIcon className="h-6 w-6 text-destructive" />}
          description="Average over last 30 days"
          trend={kpis.mortalityRateTrend}
          trendColor={kpis.mortalityRateTrend.startsWith('+') ? 'text-red-600' : 'text-green-600'}
        />
        <KpiCard
          title="Active Birds"
          value={kpis.activeBirds}
          icon={<BirdIcon className="h-6 w-6 text-accent" />}
          description="Total birds currently active"
        />
        <KpiCard
          title="Broken Eggs"
          value={kpis.brokenEggs}
          icon={<EggIcon className="h-6 w-6 text-destructive" />}
          description="Daily broken eggs"
          trend={kpis.brokenEggsTrend}
          trendColor={kpis.brokenEggsTrend.startsWith('-') ? 'text-green-600' : 'text-red-600'}
        />
         <KpiCard
          title="Feed Inventory"
          value={kpis.feedInventory}
          icon={<Package className="h-6 w-6 text-accent" />}
          description="Remaining bags in stock"
          trend={Number(kpis.feedInventory.split(' ')[0]) < 20 ? "Low stock alert" : "Stock is sufficient"}
          trendColor={Number(kpis.feedInventory.split(' ')[0]) < 20 ? "text-red-600" : "text-green-600"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <SampleLineChart
          title="Egg Production Trend"
          description="Total eggs collected over the last 6 weeks."
          data={charts.eggProductionTrend}
          dataKeys={{x: "date", y: "value"}}
          config={{ value: { label: "Total Eggs", color: "hsl(var(--chart-1))" } }}
          yAxisFormatter={(value) => `${value}`}
          yAxisDomain={['auto', 'auto']}
        />
        <SampleBarChart
          title="Feed Consumption Analysis"
          description="Total feed consumption per shed (units)."
          data={charts.feedConsumptionAnalysis}
          dataKeys={{x: "category", y1: "current"}}
          config={{
            desktop: { label: "Allocated", color: "hsl(var(--chart-2))" }
          }}
        />
      </div>
       <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
         <SampleLineChart
          title="Mortality Trend"
          description="Total mortalities recorded over the last 6 months."
          data={charts.mortalityRateTrend}
          dataKeys={{x: "date", y: "value"}}
          config={{ value: { label: "Mortalities", color: "hsl(var(--chart-5))" } }}
          yAxisFormatter={(value) => `${value}`}
          yAxisDomain={[0, 'auto']}
        />
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline">Farm Activity Log</CardTitle>
            <CardDescription>Recent activities and alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             {activityLog.length === 0 && <p className="text-muted-foreground text-sm">No recent activities found.</p>}
             {activityLog.map((item: any, index) => (
                <div key={index} className="flex items-start p-2 rounded-md bg-muted/50">
                    <ActivityIcon type={item.type} />
                    <div className="flex-1">
                        <p className="text-sm font-medium">{activityText(item)}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(item.date + 'T00:00:00'), 'PP')}</p>
                    </div>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
