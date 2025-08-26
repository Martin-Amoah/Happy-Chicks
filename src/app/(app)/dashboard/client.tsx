
"use client";

import { ManagerDashboard } from "@/app/(app)/dashboard/manager-dashboard";
import { WorkerDashboard } from "@/app/(app)/dashboard/worker-dashboard";

export function DashboardClientContent({ userRole, dashboardData, tasks, users }: { userRole: string, dashboardData: any, tasks: any[], users: any[] }) {
    // For now, we are focusing on the manager's view. 
    // The role check is kept for future scalability but worker-specific data is minimized.
    if (userRole === 'Manager') {
        return <ManagerDashboard kpis={dashboardData.kpis} charts={dashboardData.charts} activityLog={dashboardData.activityLog} />;
    }
    // Render a fallback or empty state for non-managers
    return <WorkerDashboard tasks={tasks} users={users} />;
}
