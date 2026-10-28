import { BidderSidebar } from "@/components/bidder/sidebar";
import { BidderTopbar } from "@/components/bidder/topbar";
import { WelcomeHeader } from "@/components/bidder/welcome-header";
import { KpiCards } from "@/components/bidder/kpi-cards";
import { BidTable } from "@/components/bidder/bid-table";
import { RecommendedTenders } from "@/components/bidder/recommended-tenders";
import { ClosingSoon } from "@/components/bidder/closing-soon";
import { CpoWidget } from "@/components/bidder/cpo-widget";
import { Alerts } from "@/components/bidder/alerts";

export default function BidderPortalPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased">
      <BidderSidebar />
      <div className="pl-72 flex flex-col min-h-screen">
        <BidderTopbar />
        <main className="w-full pt-16 bg-background flex-1 px-space-lg py-space-lg max-w-[1440px] mx-auto">
          <div className="flex flex-col w-full gap-space-lg pb-12">
            <WelcomeHeader />
            <KpiCards />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                <BidTable />
                <RecommendedTenders />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                <ClosingSoon />
                <CpoWidget />
                <Alerts />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
