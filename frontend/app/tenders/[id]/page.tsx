"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BreadcrumbStrip } from "@/components/tender-detail/breadcrumb";
import { TenderHeaderBanner } from "@/components/tender-detail/tender-header";
import { TabBar } from "@/components/tender-detail/tab-bar";
import { OverviewPanel } from "@/components/tender-detail/overview-panel";
import { RequirementsPanel } from "@/components/tender-detail/requirements-panel";
import { DocumentsPanel } from "@/components/tender-detail/documents-panel";
import { TimelinePanel } from "@/components/tender-detail/timeline-panel";
import { ClarificationsPanel } from "@/components/tender-detail/clarifications-panel";
import { AddendaPanel } from "@/components/tender-detail/addenda-panel";
import { ActionCard } from "@/components/tender-detail/action-card";
import { ParamsSheet } from "@/components/tender-detail/params-sheet";
import { SimilarTenders } from "@/components/tender-detail/similar-tenders";

export default function TenderDetailPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased">
      <SiteHeader />
      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
          <BreadcrumbStrip />
          <TenderHeaderBanner />
          <section className="max-w-[1440px] mx-auto px-gutter py-margin w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
              <div className="lg:col-span-8 flex flex-col gap-gutter">
                <TabBar activeTab={activeTab} onChange={setActiveTab} />
                <div className="flex flex-col gap-gutter">
                  {activeTab === "overview" && <OverviewPanel />}
                  {activeTab === "requirements" && <RequirementsPanel />}
                  {activeTab === "documents" && <DocumentsPanel />}
                  {activeTab === "timeline" && <TimelinePanel />}
                  {activeTab === "clarifications" && <ClarificationsPanel />}
                  {activeTab === "addenda" && <AddendaPanel />}
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-gutter">
                <ActionCard />
                <ParamsSheet />
              </div>
            </div>
          </section>
          <SimilarTenders />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
