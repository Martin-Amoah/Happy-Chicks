
import { createClient } from "@/lib/supabase/server";
import { 
  subDays, 
  startOfToday, 
  format, 
  eachDayOfInterval
} from 'date-fns';
import { DashboardClientContent } from './client';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const supabase = createClient();
  const today = startOfToday();
  const sevenDaysAgo = subDays(today, 6);

  const { data: { user } } = await supabase.auth.getUser();

  const [
    eggCollectionData,
    mortalityData,
    feedAllocationData,
    feedStockData,
    farmConfigData,
    profileResponse,
  ] = await Promise.all([
    supabase.from('egg_collections').select('*').gte('date', format(sevenDaysAgo, 'yyyy-MM-dd')),
    supabase.from('mortality_records').select('*').gte('date', format(sevenDaysAgo, 'yyyy-MM-dd')),
    supabase.from('feed_allocations').select('*').order('created_at', { ascending: false }),
    supabase.from('feed_stock').select('*').order('created_at', { ascending: false }),
    supabase.from('farm_config').select('*').eq('id', 1).single(),
    user ? supabase.from('profiles').select('role').eq('id', user.id).single() : Promise.resolve({ data: null, error: null }),
  ]);
  
  // Robust role check: default to 'Worker' unless explicitly 'Manager' or the admin email.
  const userRole = (user?.email === 'happychicks@admin.com' || profileResponse?.data?.role === 'Manager') ? 'Manager' : 'Worker';

  const todayStr = format(today, 'yyyy-MM-dd');

  // If the user is not a manager, calculate worker-specific stats.
  if (userRole !== 'Manager' && user) {
    const workerEggsToday = (eggCollectionData.data || []).filter(e => e.user_id === user.id && e.date === todayStr);
    const workerMortalityToday = (mortalityData.data || []).filter(m => m.user_id === user.id && m.date === todayStr);
    const workerFeedToday = (feedAllocationData.data || []).filter(a => a.user_id === user.id && a.date === todayStr);

    const totalEggsCollectedByWorker = workerEggsToday.reduce((acc, curr) => acc + curr.total_eggs, 0);

    return {
      userRole,
      dashboardData: {
        workerKpis: {
            totalEggs: totalEggsCollectedByWorker,
            eggCollectionEntries: workerEggsToday.length,
            mortalityEntries: workerMortalityToday.length,
            feedAllocationEntries: workerFeedToday.length,
        }
      },
    };
  }

  const farmConfig = farmConfigData.data;
  const BIRD_START_COUNT = farmConfig?.initial_bird_count ?? 0;

  if (eggCollectionData.error || mortalityData.error || feedAllocationData.error || feedStockData.error || (farmConfigData.error && farmConfigData.error.code !== 'PGRST116')) {
    console.error("Dashboard data fetch error:", 
      eggCollectionData.error?.message || mortalityData.error?.message || feedAllocationData.error?.message || feedStockData.error?.message || farmConfigData.error?.message
    );
    // Return empty/default data to prevent crash
    return {
      userRole,
      dashboardData: {
        kpis: {
          totalEggsToday: 'N/A',
          feedConsumption: 'N/A',
          mortalityRate: 'N/A',
          activeBirds: 'N/A',
          brokenEggs: 'N/A',
          feedInventory: 'N/A',
          cratesAndPieces: 'N/A',
        },
        charts: {
          eggCollectionPerShed: [],
          feedConsumptionAnalysis: [],
          mortalityRateTrend: []
        },
        activityLog: []
      },
    };
  }

  const eggs = eggCollectionData.data || [];
  const mortalities = mortalityData.data || [];
  const allocations = feedAllocationData.data || [];
  const stocks = feedStockData.data || [];

  // --- KPI Calculations ---
  
  const totalMortalityAllTime = mortalities.reduce((acc, curr) => acc + curr.count, 0);
  const activeBirds = BIRD_START_COUNT - totalMortalityAllTime;

  const eggsToday = eggs.filter(e => e.date === todayStr);
  
  const totalEggsToday = eggsToday.reduce((acc, curr) => acc + curr.total_eggs, 0);

  const feedTodayInBags = allocations.filter(a => a.date === todayStr && a.unit === 'bags');
  const feedConsumptionToday = feedTodayInBags.reduce((acc, curr) => acc + curr.quantity_allocated, 0);

  const mortalityLast7Days = mortalities
    .filter(m => new Date(m.date + 'T00:00:00') >= sevenDaysAgo)
    .reduce((acc, curr) => acc + curr.count, 0);

  const brokenEggsToday = eggsToday.reduce((acc, curr) => acc + curr.broken_eggs, 0);
  
  const totalStock = stocks
    .filter(s => s.unit === 'bags')
    .reduce((acc, curr) => acc + curr.quantity, 0);
  const totalAllocated = allocations
    .filter(a => a.unit === 'bags')
    .reduce((acc, curr) => acc + curr.quantity_allocated, 0);
  const feedInventory = totalStock - totalAllocated;
  
  const totalCrates = eggsToday.reduce((acc, curr) => acc + curr.crates, 0);
  const totalPieces = eggsToday.reduce((acc, curr) => acc + curr.pieces, 0);
  const finalCrates = totalCrates + Math.floor(totalPieces / 30);
  const finalPieces = totalPieces % 30;


  // --- Chart Data ---
  const eggsByShedToday = eggsToday.reduce((acc, curr) => {
    acc[curr.shed] = (acc[curr.shed] || 0) + curr.total_eggs;
    return acc;
  }, {} as Record<string, number>);
  
  const eggCollectionPerShed = Object.entries(eggsByShedToday).map(([shed, total]) => ({
    shed: shed,
    eggs: total
  }));

  const feedByShed = allocations.reduce((acc, curr) => {
    acc[curr.shed] = (acc[curr.shed] || 0) + curr.quantity_allocated;
    return acc;
  }, {} as Record<string, number>);
  const feedConsumptionAnalysis = Object.entries(feedByShed).map(([shed, total]) => ({
    category: shed,
    current: total
  }));

  const dailyMortalityData = eachDayOfInterval({ start: sevenDaysAgo, end: today })
    .map(day => {
        const formattedDay = format(day, 'yyyy-MM-dd');
        const dailyDeaths = mortalities
            .filter(m => m.date === formattedDay)
            .reduce((sum, m) => sum + m.count, 0);
        return { date: format(day, 'dd/MM'), value: dailyDeaths };
    });

  // --- Activity Log ---
  const latestAllocations = allocations.slice(0, 3).map(a => ({ type: 'feed_allocation', created_at: a.created_at, data: a }));
  const latestMortality = mortalities
    .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)
    .map(m => ({ type: 'mortality', created_at: m.created_at, data: m }));
  const latestStock = stocks.slice(0, 3).map(s => ({ type: 'feed_stock', created_at: s.created_at, data: s }));
  
  const allActivities = [...latestAllocations, ...latestMortality, ...latestStock]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return {
    userRole,
    dashboardData: {
      kpis: {
        totalEggsToday: `${totalEggsToday} Eggs`,
        cratesAndPieces: `${finalCrates} Crates, ${finalPieces} Pieces`,
        feedConsumption: `${feedConsumptionToday} bag/day`,
        mortalityRate: mortalityLast7Days,
        activeBirds: activeBirds.toLocaleString(),
        brokenEggs: `${brokenEggsToday}/day`,
        feedInventory: `${feedInventory} Bags`,
      },
      charts: {
        eggCollectionPerShed,
        feedConsumptionAnalysis,
        mortalityRateTrend: dailyMortalityData
      },
      activityLog: allActivities
    },
  }
}

export default async function DashboardPage() {
  const { userRole, dashboardData } = await getDashboardData();
  
  return (
    <DashboardClientContent 
        userRole={userRole}
        dashboardData={dashboardData}
    />
  );
}
