import { IssuerSidebar } from "@/components/issuer/sidebar";
import { IssuerTopbar } from "@/components/issuer/topbar";
import { AwardHeader } from "@/components/issuer/award-contract/award-header";
import { StandstillBanner } from "@/components/issuer/award-contract/standstill-banner";
import { WinningBidderCard } from "@/components/issuer/award-contract/winning-bidder-card";
import { ScoreRecap } from "@/components/issuer/award-contract/score-recap";
import { AcceptanceLetter } from "@/components/issuer/award-contract/acceptance-letter";
import { ContractForm } from "@/components/issuer/award-contract/contract-form";
import { ContractDossier } from "@/components/issuer/award-contract/contract-dossier";
import { GovernanceAudit } from "@/components/issuer/award-contract/governance-audit";

export default function AwardContractPage() {
  return (
    <div className="bg-background font-body-md text-on-surface">
      <IssuerSidebar />
      <div className="pl-64">
        <IssuerTopbar />
        <main className="relative w-full pt-16 bg-background px-space-xl py-space-lg min-h-screen">
          <div className="flex flex-col w-full">
            <AwardHeader />
            <StandstillBanner />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              <div className="lg:col-span-7 flex flex-col gap-space-xl">
                <WinningBidderCard />
                <ScoreRecap />
                <AcceptanceLetter />
              </div>
              <div className="lg:col-span-5 flex flex-col gap-space-xl">
                <ContractForm />
                <ContractDossier />
                <GovernanceAudit />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
