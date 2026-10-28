import { BidderSidebar } from "@/components/bidder/sidebar";
import { BidderTopbar } from "@/components/bidder/topbar";
import { TopVerificationBanner } from "@/components/bidder/company-profile/top-verification-banner";
import { ComplianceAuditCard } from "@/components/bidder/company-profile/compliance-audit-card";
import { InterAgencySync } from "@/components/bidder/company-profile/inter-agency-sync";
import { SupportCard } from "@/components/bidder/company-profile/support-card";
import { CompanyProfileSection } from "@/components/bidder/company-profile/company-profile-section";
import { WorkClassificationSection } from "@/components/bidder/company-profile/work-classification-section";
import { DocumentDossierSection } from "@/components/bidder/company-profile/document-dossier-section";
import { FooterActions } from "@/components/bidder/company-profile/footer-actions";

export default function CompanyProfilePage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased">
      <BidderSidebar />
      <div className="pl-72 flex flex-col min-h-screen">
        <BidderTopbar />
        <main className="w-full pt-16 bg-background flex-1 px-space-lg py-space-lg max-w-[1440px] mx-auto">
          <div className="flex flex-col w-full gap-space-lg">
            <TopVerificationBanner />
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-space-lg">
                <ComplianceAuditCard />
                <InterAgencySync />
                <SupportCard />
              </div>
              <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-space-lg">
                <CompanyProfileSection />
                <WorkClassificationSection />
                <DocumentDossierSection />
                <FooterActions />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
