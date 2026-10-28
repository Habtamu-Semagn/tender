import { BidderSidebar } from "@/components/bidder/sidebar";
import { BidderTopbar } from "@/components/bidder/topbar";
import { MyBidsPageHeader } from "@/components/bidder/my-bids/page-header";
import { FilterToolbar } from "@/components/bidder/my-bids/filter-toolbar";
import { BidsTable } from "@/components/bidder/my-bids/bids-table";
import { MobileCards } from "@/components/bidder/my-bids/mobile-cards";
import { BidDossierDrawer } from "@/components/bidder/my-bids/bid-dossier-drawer";

export default function MyBidsPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased">
      <BidderSidebar />
      <div className="pl-72 flex flex-col min-h-screen">
        <BidderTopbar />
        <main className="w-full pt-16 bg-background flex-1 px-space-lg py-space-lg max-w-[1440px] mx-auto">
          <div className="flex flex-col w-full space-y-space-xl">
            <MyBidsPageHeader />
            <FilterToolbar />
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
              <div className="xl:col-span-8 flex flex-col space-y-space-md">
                <BidsTable />
                <MobileCards />
              </div>
              <BidDossierDrawer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
