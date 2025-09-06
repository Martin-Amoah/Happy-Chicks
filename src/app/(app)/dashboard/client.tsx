
"use client";

import { ManagerDashboard } from "@/app/(app)/dashboard/manager-dashboard";
import { WorkerDashboard } from "@/app/(app)/dashboard/worker-dashboard";

export function DashboardClientContent({ userRole, dashboardData, tasks, users }: { userRole: string, dashboardData: any, tasks: any[], users: any[] }) {
    if (userRole === 'Manager') {
        return <ManagerDashboard kpis={dashboardData.kpis} charts={dashboardData.charts} activityLog={dashboardData.activityLog} />;
    }
    
    // Fallback to WorkerDashboard for any non-manager role.
    return <WorkerDashboard kpis={dashboardData.workerKpis} />;
}
