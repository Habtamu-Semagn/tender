import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { AdminHeaderKpi } from "@/components/admin/header-kpi";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { VerificationQueue } from "@/components/admin/verification-queue";

export default function AdminDashboardPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased">
      <AdminSidebar />
      <div className="pl-72">
        <AdminTopbar />
        <main className="w-full pt-16 bg-background px-gutter py-space-xl min-h-screen">
          <div className="flex flex-col w-full gap-space-xl">
            <AdminHeaderKpi />
            <AnalyticsCharts />
            <VerificationQueue />
          </div>
        </main>
      </div>
    </div>
  );
}
