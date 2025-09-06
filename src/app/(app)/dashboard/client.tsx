
"use client";

import { ManagerDashboard } from "@/app/(app)/dashboard/manager-dashboard";
import { WorkerDashboard } from "@/app/(app)/dashboard/worker-dashboard";
import { SalesDashboard } from "@/app/(app)/dashboard/sales-dashboard";

export function DashboardClientContent({ userRole, dashboardData }: { userRole: string, dashboardData: any }) {
    if (userRole === 'Manager') {
        return <ManagerDashboard kpis={dashboardData.kpis} charts={dashboardData.charts} activityLog={dashboardData.activityLog} />;
    }
    
    if (userRole === 'Sales Rep') {
        return <SalesDashboard kpis={dashboardData.salesKpis} recentSales={dashboardData.recentSales} />;
    }

    // Fallback to WorkerDashboard for any other role.
    return <WorkerDashboard kpis={dashboardData.workerKpis} />;
}
