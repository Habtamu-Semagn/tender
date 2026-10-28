"use client";

import { useState } from "react";
import { IssuerSidebar } from "@/components/issuer/sidebar";
import { IssuerTopbar } from "@/components/issuer/topbar";
import { DecryptionBanner } from "@/components/issuer/evaluations/decryption-banner";
import { TenderSummary } from "@/components/issuer/evaluations/tender-summary";
import { BidderRegister } from "@/components/issuer/evaluations/bidder-register";
import { ComparisonChart } from "@/components/issuer/evaluations/comparison-chart";
import { EvaluationSidePanel } from "@/components/issuer/evaluations/evaluation-side-panel";
import { CommitteeEndorsements } from "@/components/issuer/evaluations/committee-endorsements";
import { AuditModal } from "@/components/issuer/evaluations/audit-modal";
import { BIDDERS, DEFAULT_BIDDER } from "@/components/issuer/evaluations/bidder-data";

export default function EvaluationsPage() {
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_BIDDER);
  const [modalOpen, setModalOpen] = useState(false);
  const selected = BIDDERS.find((b) => b.id === selectedId) ?? BIDDERS[0];

  return (
    <div className="bg-background font-body-md text-on-surface">
      <IssuerSidebar />
      <div className="pl-64">
        <IssuerTopbar />
        <main className="relative w-full pt-16 bg-background px-space-xl py-space-lg min-h-screen">
          <div className="flex flex-col w-full">
            <DecryptionBanner onAudit={() => setModalOpen(true)} />
            <TenderSummary />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-space-lg">
                <BidderRegister selectedId={selectedId} onSelect={setSelectedId} />
                <ComparisonChart />
              </div>
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-space-md sticky top-20">
                <EvaluationSidePanel bidder={selected} />
                <CommitteeEndorsements />
              </div>
            </div>
          </div>
        </main>
      </div>
      <AuditModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
