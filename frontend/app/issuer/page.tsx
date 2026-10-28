import { IssuerSidebar } from "@/components/issuer/sidebar";
import { IssuerTopbar } from "@/components/issuer/topbar";
import { IssuerHeaderBanner } from "@/components/issuer/header-banner";
import { IssuerKpiCards } from "@/components/issuer/kpi-cards";
import { CompetitionChart } from "@/components/issuer/competition-chart";
import { TendersTable } from "@/components/issuer/tenders-table";
import { UrgentWatchlist } from "@/components/issuer/urgent-watchlist";
import { CpoEscrow } from "@/components/issuer/cpo-escrow";
import { EvalCommittee } from "@/components/issuer/eval-committee";

export default function IssuerPortalPage() {
  return (
    <div className="bg-background font-body-md text-on-surface">
      <IssuerSidebar />
      <div className="pl-64">
        <IssuerTopbar />
        <main className="relative w-full pt-16 bg-background px-space-xl py-space-lg min-h-screen">
          <div className="flex flex-col w-full gap-space-lg">
            <IssuerHeaderBanner />
            <IssuerKpiCards />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <div className="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
                <CompetitionChart />
                <TendersTable />
                <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low text-on-surface-variant">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">policy</span>
                    <span className="font-label-sm text-label-sm">FDRE Directive No. 42/2016 compliance active: Automated audit logging to FPPA federal oversight ledger.</span>
                  </div>
                  <span className="font-mono-data text-mono-data text-[11px] text-primary">SHA-256 Vault: VALID</span>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                <UrgentWatchlist />
                <CpoEscrow />
                <EvalCommittee />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
