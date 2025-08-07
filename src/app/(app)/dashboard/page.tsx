
import { createClient } from "@/lib/supabase/server";
import { 
  subDays, 
  startOfToday, 
  format, 
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  subMonths
} from 'date-fns';
import { DashboardClientContent } from './client'; // Import the new client component

async function getDashboardData() {
  const supabase = createClient();
  const today = startOfToday();
  const sevenDaysAgo = subDays(today, 6); // For a 7-day trend including today
  const sixMonthsAgo = subMonths(today, 6);

  const [
    eggCollectionData,
    mortalityData,
    feedAllocationData,
    feedStockData,
    farmConfigData,
  ] = await Promise.all([
    supabase.from('egg_collections').select('*').gte('date', format(sevenDaysAgo, 'yyyy-MM-dd')),
    supabase.from('mortality_records').select('*').gte('date', format(subDays(today, 60), 'yyyy-MM-dd')),
    supabase.from('feed_allocations').select('*').order('date', { ascending: false }),
    supabase.from('feed_stock').select('*').order('date', { ascending: false }),
    supabase.from('farm_config').select('*').eq('id', 1).single()
  ]);

  const farmConfig = farmConfigData.data;

  if (eggCollectionData.error || mortalityData.error || feedAllocationData.error || feedStockData.error || (farmConfigData.error && farmConfigData.error.code !== 'PGRST116')) {
    console.error("Dashboard data fetch error:", 
      eggCollectionData.error?.message || mortalityData.error?.message || feedAllocationData.error?.message || feedStockData.error?.message || farmConfigData.error?.message
    );
    // Return empty/default data to prevent crash
    return {
      kpis: {
        totalEggsToday: 'N/A',
        feedConsumption: 'N/A',
        mortalityRate: 'N/A',
        activeBirds: 'N/A',
        brokenEggs: 'N/A',
        feedInventory: 'N/A',
        eggCollectionTrend: 'N/A',
        feedConsumptionTrend: 'N/A',
        mortalityRateTrend: 'N/A',
        brokenEggsTrend: 'N/A'
      },
      charts: {
        eggCollectionTrend: [],
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
  const BIRD_START_COUNT = farmConfig?.initial_bird_count ?? 0;

  // --- KPI Calculations ---
  const todayStr = format(today, 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
  
  const totalMortality = mortalities.reduce((acc, curr) => acc + curr.count, 0);
  const activeBirds = BIRD_START_COUNT - totalMortality;

  const eggsToday = eggs.filter(e => e.date === todayStr);
  const eggsYesterday = eggs.filter(e => e.date === yesterdayStr);
  
  const totalEggsToday = eggsToday.reduce((acc, curr) => acc + curr.total_eggs, 0);
  const totalEggsYesterday = eggsYesterday.reduce((acc, curr) => acc + curr.total_eggs, 0);

  const eggCollectionRate = activeBirds > 0 ? (totalEggsToday / activeBirds) * 100 : 0;
  const eggCollectionRateYesterday = activeBirds > 0 ? (totalEggsYesterday / activeBirds) * 100 : 0;
  const eggCollectionTrend = eggCollectionRate - eggCollectionRateYesterday;

  const feedToday = allocations.filter(a => a.date === todayStr);
  const feedYesterday = allocations.filter(a => a.date === yesterdayStr);
  const feedConsumptionToday = feedToday.reduce((acc, curr) => acc + curr.quantity_allocated, 0);
  const feedConsumptionYesterday = feedYesterday.reduce((acc, curr) => acc + curr.quantity_allocated, 0);
  const feedConsumptionTrend = feedConsumptionToday - feedConsumptionYesterday;

  const mortalityLast30Days = mortalities
    .filter(m => new Date(m.date + 'T00:00:00') >= subDays(today, 30))
    .reduce((acc, curr) => acc + curr.count, 0);

  const mortalityPrevious30Days = mortalities
    .filter(m => {
        const date = new Date(m.date + 'T00:00:00');
        return date >= subDays(today, 60) && date < subDays(today, 30);
    })
    .reduce((acc, curr) => acc + curr.count, 0);
    
  const mortalityCountTrend = mortalityLast30Days - mortalityPrevious30Days;

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
  const dailyEggData = eachDayOfInterval({ start: sevenDaysAgo, end: today })
    .map(day => {
      const formattedDay = format(day, 'yyyy-MM-dd');
      const dailyEggs = eggs
        .filter(e => e.date === formattedDay)
        .reduce((sum, e) => sum + e.total_eggs, 0);
      return { date: format(day, 'dd/MM'), value: dailyEggs };
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
      totalEggsToday: `${totalEggsToday} Eggs`,
      feedConsumption: `${feedConsumptionToday} kg/day`,
      mortalityRate: mortalityLast30Days,
      activeBirds: activeBirds.toLocaleString(),
      brokenEggs: `${brokenEggsToday}/day`,
      feedInventory: `${feedInventory} Bags`,
      eggCollectionTrend: `${eggCollectionTrend >= 0 ? '+' : ''}${eggCollectionTrend.toFixed(1)}% from yesterday`,
      feedConsumptionTrend: `${feedConsumptionTrend >= 0 ? '+' : '-'}${Math.abs(feedConsumptionTrend)}kg from yesterday`,
      mortalityRateTrend: `${mortalityCountTrend >= 0 ? '+' : ''}${mortalityCountTrend} from last 30 days`,
      brokenEggsTrend: `${brokenEggsTrend <= 0 ? '' : '+'}${brokenEggsTrend} from yesterday`
    },
    charts: {
      eggCollectionTrend: dailyEggData,
      feedConsumptionAnalysis,
      mortalityRateTrend: monthlyMortalityData
    },
    activityLog: allActivities
  }
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();
  
  return (
    <DashboardClientContent 
        kpis={dashboardData.kpis}
        charts={dashboardData.charts}
        activityLog={dashboardData.activityLog}
    />
  );
}
